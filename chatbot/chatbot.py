from flask import Flask, request, jsonify  # Flask 관련 모듈을 import
from flask_cors import CORS  # CORS 설정을 위한 모듈을 import
from sentence_transformers import SentenceTransformer, util  # 문장 임베딩 및 유사도 계산을 위한 모듈을 import
import openai  # OpenAI API 모듈을 import
import os  # 운영 체제와 관련된 작업을 위한 모듈을 import
import torch  # PyTorch 모듈을 import

from dotenv import load_dotenv  # .env 파일에서 환경 변수를 로드하기 위한 모듈을 import

app = Flask(__name__)  # Flask 애플리케이션 인스턴스를 생성
CORS(app)  # CORS를 활성화하여 외부 도메인에서의 요청을 허용

load_dotenv()  # .env 파일을 로드하여 환경 변수를 설정
openai.api_key = os.getenv('OPENAI_API_KEY')  # 환경 변수에서 OpenAI API 키를 가져와 설정
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")  # SentenceTransformer 모델을 로드
vault_file_path = os.path.join(os.path.dirname(__file__), '../chatbot/vault.txt')  # vault1.txt 파일의 경로를 설정

def load_vault():
    if os.path.exists(vault_file_path):  # vault1.txt 파일이 존재하는지 확인
        with open(vault_file_path, "r", encoding='utf-8') as vault_file:  # 파일을 읽기 모드로 열기
            return vault_file.readlines()  # 파일의 모든 줄을 리스트로 반환
    return []  # 파일이 존재하지 않으면 빈 리스트 반환

vault_content = load_vault()  # vault_content에 vault1.txt 파일의 내용을 로드

vault_embeddings = model.encode(vault_content) if vault_content else []  # 파일 내용이 있으면 임베딩 생성, 없으면 빈 리스트 반환

@app.route('/query', methods=['POST'])  # '/query' 경로에 대해 POST 요청을 처리하는 엔드포인트 정의
def query():
    data = request.json  # 요청의 JSON 본문을 가져오기
    user_query = data.get('query', '')  # 요청 데이터에서 'query' 필드를 가져오기, 없으면 빈 문자열 반환
    
    if not user_query:  # 'query' 필드가 비어 있으면
        return jsonify({'error': 'Query is required.'}), 400  # 에러 메시지와 함께 400 상태 코드 반환
    
    def get_relevant_context(user_input, vault_embeddings, vault_content, model, top_k=3):
        if len(vault_embeddings) == 0:  # vault_embeddings가 비어 있으면
            return []  # 빈 리스트 반환
        input_embedding = model.encode([user_input])  # 사용자 입력을 임베딩으로 변환
        cos_scores = util.cos_sim(input_embedding, vault_embeddings)[0]  # 유사도 점수를 계산
        
        # cos_sim =  코사인 유사도(Cosine Similarity)
        # BoW에 기반한 단어 표현 방법인 DTM, TF-IDF, 또는 뒤에서 배우게 될 Word2Vec 등과 같이 단어를 수치화할 수 있는 방법을 이해했다면
        # 이러한 표현 방법에 대해서 코사인 유사도를 이용하여 문서의 유사도를 구하는 게 가능합니다.
        # 코사인 유사도는 두 벡터 간의 코사인 각도를 이용하여 구할 수 있는 두 벡터의 유사도를 의미합니다.
        # 두 벡터의 방향이 완전히 동일한 경우에는 1의 값을 가지며, 90°의 각을 이루면 0, 180°로 반대의 방향을 가지면 -1의 값을 갖게 됩니다.
        # 즉, 결국 코사인 유사도는 -1 이상 1 이하의 값을 가지며 값이 1에 가까울수록 유사도가 높다고 판단할 수 있습니다. 이를 직관적으로 이해하면
        # 두 벡터가 가리키는 방향이 얼마나 유사한가를 의미합니다.
        
        top_k = min(top_k, len(cos_scores))  # top_k 값 조정
        
#       Top-K 샘플링에서는 모델이 예측한 단어들 중 확률이 가장 높은 상위 K개의 단어만을 고려합니다.
#
#        예를 들어, K=3인 경우:
#       - hot (35%)
#       - warm (25%)
#       - cold (10%)
#
#       이렇게 확률이 높은 상위 3개의 단어만을 고려하게 됩니다.
#
#       "Top-K=0 & Top-P=0.5"로 설정할 경우:
#        Top-K=0:
#        K의 값이 0이므로, 모델은 확률이 가장 높은 단어들의 수를 기준으로 제한을 받지 않습니다. 즉, Top-K 제한은 적용되지 않습니다.
#
#        Top-P=0.5:
#        누적 확률이 50%에 도달할 때까지의 단어들만을 고려합니다.
#
#        이전 예시를 기반으로 살펴보면:
#        - hot (35%)
#
#        이렇게 확률이 35%인 'hot'만을 고려하게 됩니다.
#        
#        즉, Top-K=0 & Top-P=0.5 설정은 모델이 'hot' 단어만을 생성하도록 제한됩니다. 하지만 실제로 이런 설정을 사용하는 경우는 드물며, 대부분의 경우 Top-K나 Top-P 값은 조금 더 유연하게 설정됩니다.

        top_indices = torch.topk(cos_scores, k=top_k).indices.tolist()  # 상위 k개의 인덱스 찾기
        relevant_context = [vault_content[idx].strip() for idx in top_indices]  # 상위 인덱스에 해당하는 내용 추출
        return relevant_context  # 관련 컨텍스트 반환
    
    relevant_context = get_relevant_context(user_query, vault_embeddings, vault_content, model)  # 사용자 쿼리에 대한 관련 컨텍스트 얻기
    context_str = "\n".join(relevant_context) if relevant_context else ""  # 관련 컨텍스트를 문자열로 변환, 없으면 빈 문자열
    
    messages = [  # OpenAI API에 보낼 메시지 구성
        {"role": "system", "content": "You are a helpful assistant that is an expert at extracting the most useful information from a given text. You must answer in Korean"},  # 시스템 메시지 설정
        {"role": "user", "content": f"{context_str}\n\n{user_query}"}  # 사용자 메시지 설정
    ]

    try:
        response = openai.chat.completions.create(  # OpenAI의 chat completions API 호출
            model="gpt-4o-mini",  # 사용할 모델 설정
            messages=messages  # 메시지 전달
        )
        result = response.choices[0].message.content  # 응답에서 결과 추출
        return jsonify({'result': result})  # 결과를 JSON으로 반환
    except Exception as e:  # 예외 발생 시
        return jsonify({'error': str(e)}), 500  # 에러 메시지와 함께 500 상태 코드 반환
#Embeddings for each line in the vault:
#tensor([[-0.1188,  0.0483, -0.0025,  ...,  0.1264,  0.0465, -0.0157],
#        [ 0.0237, -0.0306,  0.0655,  ..., -0.0443, -0.0280,  0.0370],
#        [-0.1188,  0.0483, -0.0025,  ...,  0.1264,  0.0465, -0.0157],
#        ...,
#        [-0.1188,  0.0483, -0.0025,  ...,  0.1264,  0.0465, -0.0157],
#        [ 0.0347,  0.1139,  0.0339,  ...,  0.0295, -0.0482, -0.0029],
#        [-0.1188,  0.0483, -0.0025,  ...,  0.1264,  0.0465, -0.0157]])
#
#우리가 넣은 vault.txt라는 파일을 임베딩 해서 얻은 top_k 값을 이용해서 상위 k개의 인덱스 찾기





if __name__ == '__main__':  # 스크립트가 직접 실행될 때
    app.run(port=5000, debug=True)  # Flask 애플리케이션을 5000 포트에서 디버그 모드로 실행


from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
import openai
import os
import torch

from dotenv import load_dotenv


app = Flask(__name__)
CORS(app)  # CORS 설정 추가

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')
model = SentenceTransformer("all-MiniLM-L6-v2")
vault_file_path = os.path.join(os.path.dirname(__file__), '../chatbot/vault.txt')

def load_vault():
    if os.path.exists(vault_file_path):
        with open(vault_file_path, "r", encoding='utf-8') as vault_file:
            return vault_file.readlines()
    return []

vault_content = load_vault()
vault_embeddings = model.encode(vault_content) if vault_content else []

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    user_query = data.get('query', '')
    
    if not user_query:
        return jsonify({'error': 'Query is required.'}), 400
    
    def get_relevant_context(user_input, vault_embeddings, vault_content, model, top_k=3):
        if len(vault_embeddings) == 0:
            return []
        input_embedding = model.encode([user_input])
        cos_scores = util.cos_sim(input_embedding, vault_embeddings)[0]
        top_k = min(top_k, len(cos_scores))
        top_indices = torch.topk(cos_scores, k=top_k).indices.tolist()
        relevant_context = [vault_content[idx].strip() for idx in top_indices]
        return relevant_context
    
    relevant_context = get_relevant_context(user_query, vault_embeddings, vault_content, model)
    context_str = "\n".join(relevant_context) if relevant_context else ""

    messages = [
        {"role": "system", "content": "You are a helpful assistant that is an expert at extracting the most useful information from a given text. You must answer in Korean"},
        {"role": "user", "content": f"{context_str}\n\n{user_query}"}
    ]

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        result = response.choices[0].message.content
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)

from flask import Flask, request, jsonify
from langchain_community.vectorstores import Chroma
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader
import os
import warnings
from dotenv import load_dotenv

app = Flask(__name__)

# 환경 변수 로드
load_dotenv()
warnings.filterwarnings("ignore")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# Load documents and initialize vector store
loader = TextLoader('vault.txt', encoding='utf-8')
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.split_documents(documents)

persist_directory = 'db'
embedding = OpenAIEmbeddings()
vectordb = Chroma.from_documents(documents=texts, embedding=embedding, persist_directory=persist_directory)
vectordb.persist()
vectordb = None

vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
retriever = vectordb.as_retriever()
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=False
)

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    query_text = data.get('query', '')
    llm_response = qa_chain(query_text)
    return jsonify({'result': llm_response['result']})

if __name__ == '__main__':
    app.run(debug=True)

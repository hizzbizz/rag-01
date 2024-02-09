
from txtai.embeddings import Embeddings
from datetime import datetime
from flask import Flask, request, jsonify
import os

now = datetime.now()
texts = [ ]
with open('data.txt') as my_file:
    texts = my_file.readlines()

embeddings = Embeddings({"path": "sentence-transformers/all-MiniLM-L6-v2", "content": True})
embeddings.index((x, text, None) for x, text in enumerate(texts))

print("Current Time =", datetime.now().strftime("%H:%M:%S"), " | Creating extractor")


def prompt(question):
    return f"""Answer the following question using only the context below. Say 'no answer' when the question can't be answered.
Question: {question}
Context: """


def search(query):
    return embeddings.search(query)

app = Flask(__name__, static_folder=os.getenv('FRONTEND_STATIC', '../frontend/build'), static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/query', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    # process your data here
    response = {"question": data['question'], "answer": search(data['question'])}
    return jsonify(response), 200

@app.route('/data', methods=['GET'])
def data_endpoint():
    return jsonify(texts)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)

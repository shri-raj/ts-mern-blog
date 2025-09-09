import logging
import schedule
import time
import threading
from flask import Flask, request, jsonify
from rag_service import search_similar, generate_answer, index_content

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route('/api/qa/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "Missing 'question' in request body"}), 400
    
    question = data['question']
    if not isinstance(question, str) or len(question) < 5:
        return jsonify({"error": "'question' must be a string of at least 5 characters"}), 400

    try:
        context = search_similar(question)
        answer = generate_answer(question, context)
        return jsonify({"answer": answer})
    except Exception as e:
        logging.error(f"Error processing question: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

def run_scheduler():
    """Run scheduled tasks in a background thread."""
    schedule.every(5).minutes.do(index_content)
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    logging.info("Performing initial content indexing on startup...")
    index_content()
    
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    app.run(host='0.0.0.0', port=4003)
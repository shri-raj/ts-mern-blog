import logging
import requests
import numpy as np
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logging.info("SentenceTransformer model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load SentenceTransformer model: {e}")
    model = None

vector_store = []
POSTS_SERVICE_URL = "http://posts-service:4002/api/posts"

def generate_embedding(text):
    if model is None:
        raise RuntimeError("Embedding model is not available.")
    return model.encode(text, convert_to_tensor=False)

def index_content():
    """
    Fetches all posts from the posts-service and indexes their content.
    """
    global vector_store
    logging.info("Starting content indexing...")
    try:
        response = requests.get(POSTS_SERVICE_URL)
        response.raise_for_status() 
        posts = response.json()

        if not posts:
            logging.warning("No posts found to index.")
            return

        new_vector_store = []
        for post in posts:
            combined_text = f"Title: {post.get('title', '')}. Content: {post.get('content', '')}"
            embedding = generate_embedding(combined_text)
            new_vector_store.append({
                "id": post.get("id"),
                "title": post.get("title"),
                "content": post.get("content"),
                "embedding": embedding
            })
        
        vector_store = new_vector_store
        logging.info(f"Indexing complete. {len(vector_store)} posts indexed.")
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch posts for indexing: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred during indexing: {e}")

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def search_similar(query, top_k=3):
    """
    Finds the most similar posts to a given query.
    """
    if not vector_store:
        logging.warning("Vector store is empty. Attempting to index now.")
        index_content()
        if not vector_store:
            logging.error("Vector store is still empty after re-indexing. Cannot perform search.")
            return []

    query_embedding = generate_embedding(query)
    
    scored_items = []
    for item in vector_store:
        similarity = cosine_similarity(query_embedding, item["embedding"])
        scored_items.append({
            "id": item["id"],
            "title": item["title"],
            "content": item["content"],
            "similarity": similarity
        })
    
    scored_items.sort(key=lambda x: x["similarity"], reverse=True)
    return scored_items[:top_k]

def generate_answer(query, context):
    """
    Generates a simple answer based on the retrieved context.
    (This is a mock LLM response).
    """
    if not context:
        return "I'm sorry, I couldn't find any relevant information in the existing blog posts to answer your question."

    context_text = "\n\n---\n\n".join([f"From post titled '{c['title']}':\n{c['content']}" for c in context])
    
    prompt = f"Based on the following context, please answer the user's question.\n\nContext:\n{context_text}\n\nQuestion: {query}\n\nAnswer:"
    
    logging.info(f"Generated prompt for LLM: {prompt}")

    return f"Based on the retrieved content, here is some relevant information:\n\n{context_text}"
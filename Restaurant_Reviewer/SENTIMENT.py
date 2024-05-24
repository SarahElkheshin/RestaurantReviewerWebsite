import torch
from transformers import BertTokenizer, BertForSequenceClassification
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Load pre-trained BERT model and tokenizer
model = BertForSequenceClassification.from_pretrained("bert-base-uncased")
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Set the model to evaluation mode
model.eval()

# Function to preprocess text data
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    return text

# Define function to predict sentiment
def predict_sentiment(text):
    # Preprocess text data
    text = preprocess_text(text)
    # Tokenize and encode text
    inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    with torch.no_grad():
        # Perform inference
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1).tolist()[0]
        positive_prob = probabilities[1]  # Probability of positive sentiment
    return positive_prob

# Define route for sentiment analysis
@app.route("/predict-sentiment", methods=["POST"])
def predict_sentiment_api():
    # Get text data from request
    data = request.get_json()
    text = data["text"]
    
    # Predict sentiment
    positive_prob = predict_sentiment(text)
    sentiment = "positive" if positive_prob > 0.5 else "negative"
    
    return jsonify({"sentiment": sentiment, "confidence": positive_prob})

if __name__ == "__main__":
    app.run(debug=True)



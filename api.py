from flask import Flask, request, jsonify
from flask_cors import CORS
import tweepy
from textblob import TextBlob

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load API keys
mykeys = open('twitterapikey.txt', 'r').read().splitlines()
bearer_token = mykeys[4]

# Authenticate Twitter API
client = tweepy.Client(bearer_token=bearer_token)

@app.route('/sentiment', methods=['GET'])
def sentiment_analysis():
    search_term = request.args.get('query')  # Get the search term from the frontend
    if not search_term:
        return jsonify({"error": "No search term provided"}), 400

    tweet_amount = 50  # Adjust as needed
    tweets = client.search_recent_tweets(query=search_term, max_results=tweet_amount)
    
    results = []
    if tweets.data:
        for tweet in tweets.data:
            analysis = TextBlob(tweet.text)
            sentiment = "positive" if analysis.polarity > 0 else "negative" if analysis.polarity < 0 else "neutral"
            results.append({"tweet": tweet.text, "sentiment": sentiment})

    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)

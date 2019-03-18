from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from twitter_client import TwitterClient

app = Flask(__name__)
CORS(app)
api = TwitterClient()

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/tweets')
def tweets():
    query = request.args.get('query')
    tweets = api.get_tweets(query)
    return jsonify({'data': tweets, 'count': len(tweets)})


port = 5001
app.run(host="0.0.0.0", port=port, debug=True)

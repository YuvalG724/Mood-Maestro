from flask import Flask, jsonify, render_template
from Emotion3 import detect_emotion

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/detect-emotion', methods=['POST'])
def detect():
    emotion = detect_emotion()
    return jsonify({"emotion": emotion})


if __name__=="__main__":
    app.run(debug=True)
Mood Maestro – Mood to Music Playlist Recommender
1) Project Description
Mood Maestro is a web application that detects a user's emotional state and recommends personalized music playlists. It listens for a wake word and uses the webcam and microphone to analyze facial expressions and vocal tone. Based on this, it classifies the user’s mood into one of eight categories. The app then redirects the user to a curated playlist on either Spotify. An OpenAI-powered chatbot is also integrated to allow users to express their feelings and receive supportive responses.

2) Features
Real-time mood detection using facial expressions and vocal tone

Playlist recommendations from Spotify.

OpenAI-powered chatbot for emotional support

Voice input support for mood detection

Mood shortcut buttons for quick interaction

User-friendly interface with smooth animations and transitions

3) Running the Website
Frontend:

Open index.html in a browser directly or using a local server (e.g., Live Server extension in VS Code)

Backend (Python Flask):

Install required packages:

nginx
Copy
Edit
pip install flask flask-cors openai
Run the backend server:

nginx
Copy
Edit
python app.py
Ensure API keys are correctly configured in the JavaScript (script.js) and backend (app.py)

4) Demo Video
To be added after frontend and backend integration is complete.

5) Tech Stack and Libraries
Frontend: HTML, Tailwind CSS, JavaScript

Backend: Python (Flask)

APIs: Spotify API, YouTube Music (via redirect), OpenAI API

Libraries: flask, flask-cors, openai, Web Speech API

6) Supported Platforms
Spotify

YouTube Music

7) Project Components
index.html: Frontend interface

style.css: Styling and layout

script.js: Mood detection and API integration

app.py: Chatbot backend using OpenAI

.env (not included): Contains API keys

8) Current Condition
Frontend UI complete.
Chatbot interface is work under progress.
Integration of facial and voice-based emotion detection is pending

9) Authors
Yuval Gupta
Nitigya Khaneja
Datla Vinay Varma


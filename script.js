//API KEYS 
const SPOTIFY_CLIENT_ID = "9ab400a6cedf472488a9c3ab60886d34";
const SPOTIFY_CLIENT_SECRET = "895a76835eaf407890b2a7279f524253";
const OPENAI_API_KEY = "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";

// DOM ELEMENTS 
const moodInput = document.getElementById("moodInput");
const getPlaylistButton = document.getElementById("getPlaylistButton");
const playlistOutput = document.getElementById("playlist-output");
const moodOptionsDiv = document.getElementById("moodOptions");
const chatbotResponse = document.getElementById("chatbot-response");
const chatMoodInput = document.getElementById("chatMoodInput");
const micButton = document.getElementById("micButton");

// BACKGROUND BLOBS 
const blobBg = document.getElementById("animated-bg");
for (let i = 0; i < 3; i++) {
  const blob = document.createElement("div");
  blob.className = "blob";
  blob.style.top = `${Math.random() * 80}%`;
  blob.style.left = `${Math.random() * 80}%`;
  blobBg.appendChild(blob);
}

//  SPEECH-TO-TEXT 
micButton.onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    moodInput.value = transcript;
  };
  recognition.start();
};

//  MOOD OPTIONS 
const MOODS = ["happy", "sad", "angry", "calm", "romantic", "party", "focus"];
function moodEmoji(mood) {
  const emojis = {
    happy: "😊", sad: "😢", angry: "😠", calm: "😌",
    romantic: "❤️", party: "🎉", focus: "🧠"
  };
  return emojis[mood] || "🎶";
}
function populateMoodOptions() {
  MOODS.forEach(mood => {
    const btn = document.createElement("span");
    btn.className = "bg-gray-800 hover:bg-purple-700 text-gray-100 px-4 py-2 rounded-full cursor-pointer transition duration-200 transform hover:scale-105 text-sm";
    btn.innerHTML = `${moodEmoji(mood)} ${mood}`;
    btn.onclick = () => {
      moodInput.value = mood;
      fetchAndDisplayPlaylists(mood);
    };
    moodOptionsDiv.appendChild(btn);
  });
}
document.addEventListener("DOMContentLoaded", populateMoodOptions);

//  SPOTIFY AUTH 
async function getSpotifyToken() {
  const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`
    },
    body: "grant_type=client_credentials"
  });
  const data = await res.json();
  return data.access_token;
}

// FETCH SPOTIFY PLAYLISTS 
async function fetchPlaylists(mood, token) {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist&limit=6`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.playlists.items;
}

//  DISPLAY PLAYLIST CARDS 
async function fetchAndDisplayPlaylists(mood) {
  playlistOutput.innerHTML = `<p class="text-purple-300 text-center col-span-3">Fetching playlists...</p>`;
  const token = await getSpotifyToken();
  const playlists = await fetchPlaylists(mood, token);

  if (!playlists.length) {
    playlistOutput.innerHTML = `<p class="text-red-400">No playlists found for "${mood}".</p>`;
    return;
  }

  playlistOutput.innerHTML = "";
  playlists.forEach(pl => {
    const div = document.createElement("div");
    div.className = "playlist-card";
    div.innerHTML = `
      <img src="${pl.images[0]?.url}" alt="cover" class="playlist-img"/>
      <div class="playlist-name">${pl.name}</div>
      <div class="playlist-description">${pl.description || 'No description'}</div>
      <div class="playlist-owner">👤 ${pl.owner.display_name}</div>
      <div class="playlist-tracks">🎵 ${pl.tracks.total} tracks</div>
      <div class="playlist-followers">❤️ ${pl.followers?.total || 'N/A'} followers</div>
      <a class="spotify-link mt-3" href="${pl.external_urls.spotify}" target="_blank">Open on Spotify</a>
    `;
    playlistOutput.appendChild(div);
  });
}

//  ON BUTTON CLICK 
getPlaylistButton.onclick = () => {
  const mood = moodInput.value.trim().toLowerCase();
  if (!mood) return alert("Please enter a mood!");
  fetchAndDisplayPlaylists(mood);
};

// GPT-POWERED CHATBOT 
async function startTherapyFromInput() {
  const mood = chatMoodInput.value.trim();
  if (!mood) return alert("Type what you're feeling.");
  chatbotResponse.innerHTML = "<p class='text-gray-400'>Typing...</p>";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a compassionate therapy assistant." },
        { role: "user", content: `I'm feeling ${mood}. Can we talk about it?` }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Couldn't fetch a response.";
  chatbotResponse.innerHTML = `<div class="bg-gray-800 p-4 rounded-xl text-sm text-purple-200">${reply}</div>`;
}

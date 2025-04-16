// Redirect to login if not logged in
if (!localStorage.getItem("loggedInUser")) {
  window.location.href = "login.html";
}

// Display user name in the auth bar
const userName = localStorage.getItem("loggedInUser");
document.getElementById("user-name").innerText = userName;

// Logout handler
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ---------------------------------- AUDIO & PADS ----------------------------------
const audioElements = {};
const activePads = {};
const padFX = {};
const stockSounds = {
  Q: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  W: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  E: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  A: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  S: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  D: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  Z: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  X: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  C: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
};

function loadAudioPads() {
  Object.keys(stockSounds).forEach(key => {
    const audio = new Audio(stockSounds[key]);
    audioElements[key] = audio;
  });
}

function togglePadPlayback(key) {
  const audio = audioElements[key];
  if (!audio) return;

  if (activePads[key]) {
    audio.pause();
    audio.currentTime = 0;
    delete activePads[key];
  } else {
    applyPadFX(audio, key);
    audio.play();
    activePads[key] = true;
    audio.onended = () => delete activePads[key];
  }
}

function setPadFX(key, fxType, value) {
  if (!padFX[key]) padFX[key] = {};
  padFX[key][fxType] = value;
}

function applyPadFX(audio, key) {
  const fx = padFX[key];
  if (!fx) return;
  if (fx.volume !== undefined) audio.volume = fx.volume;
  if (fx.playbackRate !== undefined) audio.playbackRate = fx.playbackRate;
}

// ---------------------------------- TRACK FX CONTROLS ----------------------------------
const trackNames = ['Kick', 'Snare', 'Hi-Hat', 'Bass', 'Synth'];

function loadTrackFXControls() {
  const container = document.getElementById("track-fx-container");
  container.innerHTML = "";

  trackNames.forEach((track, index) => {
    const trackDiv = document.createElement("div");
    trackDiv.className = "track-fx";

    trackDiv.innerHTML = `
      <h4>🎚️ Track: ${track}</h4>
      <label>Volume: 
        <input type="range" min="0" max="1" step="0.01" value="0.8" 
        onchange="updateTrackFX(${index}, 'volume', this.value)" />
      </label>
      <label>Pan: 
        <input type="range" min="-1" max="1" step="0.01" value="0" 
        onchange="updateTrackFX(${index}, 'pan', this.value)" />
      </label>
      <label>Delay: 
        <input type="range" min="0" max="1" step="0.01" value="0.3" 
        onchange="updateTrackFX(${index}, 'delay', this.value)" />
      </label>
    `;

    container.appendChild(trackDiv);
  });
}

function updateTrackFX(trackIndex, effect, value) {
  console.log(`Track ${trackIndex} ${effect} set to ${value}`);
}

function savePreset() {
  alert("Preset saved!");
  // Save FX state
}

function loadPreset() {
  alert("Preset loaded!");
  // Load FX state
}

// ---------------------------------- SEQUENCER ----------------------------------
const trackKeys = Object.keys(stockSounds);
let tracks = [];
let currentStep = 0;
let sequencerInterval;

function addTrack() {
  if (tracks.length >= trackKeys.length) {
    alert("No more keys to assign!");
    return;
  }

  const key = trackKeys[tracks.length];
  const trackDiv = document.createElement("div");
  trackDiv.className = "track";
  trackDiv.innerHTML = `<label>${key}</label><div class="step-row"></div>`;

  const stepRow = trackDiv.querySelector(".step-row");
  const stepToggles = [];

  for (let i = 0; i < 16; i++) {
    const step = document.createElement("div");
    step.className = "step";
    step.onclick = () => step.classList.toggle("active");
    stepRow.appendChild(step);
    stepToggles.push(step);
  }

  document.getElementById("sequencer-tracks").appendChild(trackDiv);
  tracks.push({ key, steps: stepToggles });
}

function startSequencer() {
  stopSequencer();
  sequencerInterval = setInterval(() => {
    tracks.forEach(({ key, steps }) => {
      steps.forEach((step, idx) => {
        step.classList.remove("playing");
        if (idx === currentStep) step.classList.add("playing");
      });
      if (steps[currentStep].classList.contains("active")) {
        togglePadPlayback(key);
      }
    });
    currentStep = (currentStep + 1) % 16;
  }, 300);
}

function stopSequencer() {
  clearInterval(sequencerInterval);
  currentStep = 0;
  document.querySelectorAll(".step").forEach(step => step.classList.remove("playing"));
}

// ---------------------------------- UI & EVENTS ----------------------------------
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const index = ['sequencer', 'pads', 'fx', 'library', 'challenges', 'settings'].indexOf(tabId);
  document.querySelectorAll('.tab-btn')[index]?.classList.add('active');
}
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

function highlightPad(key) {
  const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
  if (pad) {
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 200);
  }
}

function showDisplay(message) {
  const display = document.getElementById("display-text");
  if (display) display.textContent = message;
}

function saveProject() {
  alert("Project saved!");
}

function loadProject() {
  alert("Project loaded!");
}

// ---------------------------------- INIT ----------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadAudioPads();
  setupPadListeners();
  loadTrackFXControls();
  showTab("pads");
});

// Pad listeners
function setupPadListeners() {
  document.querySelectorAll(".drum-pad").forEach(pad => {
    const key = pad.dataset.key;
    pad.addEventListener("click", () => {
      togglePadPlayback(key);
      highlightPad(key);
      showDisplay(`Playing: ${key}`);
    });
  });
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const index = ['sequencer', 'pads', 'fx', 'library', 'challenges', 'settings'].indexOf(tabId);
  document.querySelectorAll('.tab-btn')[index]?.classList.add('active');
}


// Keyboard pad triggers
document.addEventListener("keydown", e => {
  const key = e.key.toUpperCase();
  if (stockSounds[key]) {
    togglePadPlayback(key);
    highlightPad(key);
    showDisplay(`Playing: ${key}`);
  }
});

// Upload sample
document.getElementById("upload-sample").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    autoAssignKey(url);
  }
});

function autoAssignKey(sampleUrl) {
  for (let key of trackKeys) {
    if (!audioElements[key]) {
      audioElements[key] = new Audio(sampleUrl);
      showDisplay(`Auto-mapped to ${key}`);
      return;
    }
  }
  alert("All pads assigned!");
}

// Loop toggle
const loopToggle = document.getElementById("loop-toggle-checkbox");
loopToggle.addEventListener("change", () => {
  alert(loopToggle.checked ? "Loop Enabled" : "Loop Disabled");
});

// Redirect to login if not logged in
if (!localStorage.getItem("loggedInUser")) {
  window.location.href = "login.html";
}

// Display user name in the auth bar
const userName = localStorage.getItem("loggedInUser");
document.getElementById("user-name").innerText = userName;

// Handle Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

const activePads = {};
const audioElements = {};
const sequencerSteps = 16;
let sequencerInterval = null;
let sequenceIndex = 0;

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  document.getElementById("user-name").innerText = username;

  document.querySelectorAll(".drum-pad").forEach(pad => {
    const key = pad.getAttribute("data-key");
    const audio = new Audio(stockSounds[key]);
    audioElements[key] = audio;
    pad.addEventListener("click", () => togglePadPlayback(key));
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (stockSounds[key]) {
      togglePadPlayback(key);
    }
  });

const steps = [];

function initSequencerSteps(stepCount = 16) {
  const grid = document.getElementById("sequencer-grid");
  grid.innerHTML = "";
  steps.length = 0;
  for (let i = 0; i < stepCount; i++) {
    const step = document.createElement("div");
    step.classList.add("step");
    step.addEventListener("click", () => toggleStep(i));
    grid.appendChild(step);
    steps.push(step);
  }
}
  
function startPlayhead(interval = 300) {
  let index = 0;
  setInterval(() => {
    steps.forEach((step, i) => step.classList.toggle("playing", i === index));
    index = (index + 1) % steps.length;
  }, interval);
}

initSequencerSteps();
startPlayhead();

  
  showTab("pads"); // default tab
});

function togglePadPlayback(key) {
  const audio = audioElements[key];
  if (!audio) return;

  if (activePads[key]) {
    audio.pause();
    audio.currentTime = 0;
    delete activePads[key];
  } else {
    audio.play();
    activePads[key] = true;
    audio.onended = () => delete activePads[key];
  }
}

function toggleAudio(key) {
  const audio = audioElements[key];
  if (audio.paused) {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    audio.currentTime = startTimeInput.value;
    audio.loop = loopToggle.checked;
    applyPadFX(audio, key);
    audio.play();
    visualizeAudio(audio);
    currentAudio = audio;
    display.textContent = `Playing: ${key}`;
  } else {
    audio.pause();
    display.textContent = `Stopped: ${key}`;
  }
}


// Tabs
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

// Sequencer
function addTrack() {
  const grid = document.getElementById("sequencer-grid");
  const row = document.createElement("div");
  row.classList.add("sequencer-row");

  for (let i = 0; i < sequencerSteps; i++) {
    const step = document.createElement("div");
    step.classList.add("step");
    step.onclick = () => step.classList.toggle("active");
    row.appendChild(step);
  }

  grid.appendChild(row);
}

function clearSequencer() {
  document.getElementById("sequencer-grid").innerHTML = "";
}

function playSequence() {
  stopSequence();
  sequenceIndex = 0;
  sequencerInterval = setInterval(() => {
    const rows = document.querySelectorAll(".sequencer-row");
    rows.forEach((row, rowIndex) => {
      const steps = row.querySelectorAll(".step");
      if (steps[sequenceIndex] && steps[sequenceIndex].classList.contains("active")) {
        const key = Object.keys(stockSounds)[rowIndex % Object.keys(stockSounds).length];
        togglePadPlayback(key);
      }
    });

    sequenceIndex = (sequenceIndex + 1) % sequencerSteps;
  }, 300); // step duration
}

function stopSequence() {
  clearInterval(sequencerInterval);
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}


// Tab switching functionality
function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => {
    tab.classList.remove("active");
  });

  const activeTab = document.getElementById(tabId);
  activeTab.classList.add("active");
}

const padFX = {};

function setPadFX(key, fxType, value) {
  if (!padFX[key]) padFX[key] = {};
  padFX[key][fxType] = value;
}

function applyPadFX(audio, key) {
  const fx = padFX[key];
  if (!fx) return;

  // Example: apply volume or playbackRate
  if (fx.volume !== undefined) {
    audio.volume = fx.volume;
  }
  if (fx.playbackRate !== undefined) {
    audio.playbackRate = fx.playbackRate;
  }
}

// Save Project functionality
function saveProject() {
  alert("Project saved!");
}
// Stock audio sample URLs mapped to keys
const padAudioMap = {};
const stockSamples = {
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

// Load audio for each key
function loadAudioPads() {
  Object.keys(stockSamples).forEach(key => {
    const audio = new Audio(stockSamples[key]);
    audio.loop = false;
    padAudioMap[key] = {
      audio: audio,
      isPlaying: false
    };
  });
}

// Toggle play/stop per pad
function togglePadAudio(key) {
  const pad = padAudioMap[key];
  if (!pad) return;

  if (pad.isPlaying) {
    pad.audio.pause();
    pad.audio.currentTime = 0;
    pad.isPlaying = false;
  } else {
    pad.audio.currentTime = 0;
    pad.audio.play();
    pad.isPlaying = true;

    pad.audio.onended = () => {
      pad.isPlaying = false;
    };
  }
}

// Add click listeners to pads
function setupPadListeners() {
  const drumPads = document.querySelectorAll('.drum-pad');
  drumPads.forEach(pad => {
    const key = pad.dataset.key;
    pad.addEventListener('click', () => {
      togglePadAudio(key);
    });
  });
}

// Initialize pads
document.addEventListener('DOMContentLoaded', () => {
  loadAudioPads();
  setupPadListeners();
});

// Function to play sound based on key
function playSound(key) {
  const url = stockSounds[key.toUpperCase()];
  if (!url) return;

  const audio = new Audio(url);
  audio.currentTime = 0;
  audio.play().catch(err => console.log("Audio play error:", err));
}

// Listen for key presses
document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (stockSounds[key]) {
    playSound(key);
    showDisplay(`Playing pad: ${key}`);
    highlightPad(key);
  }
});

function autoAssignKey(sampleUrl) {
  const availableKeys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
  for (let key of availableKeys) {
    if (!audioElements[key]) {
      createAudio(key, sampleUrl);
      display.textContent = `Auto-mapped sample to ${key}`;
      return;
    }
  }
  alert("All pads are already assigned!");
}

uploadInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    autoAssignKey(url);
  }
});

const trackKeys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
let tracks = [];
let currentStep = 0;
let sequencerInterval;

function addTrack() {
  if (tracks.length >= trackKeys.length) {
    alert("No more available keys to assign!");
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
  stopSequencer(); // stop existing
  sequencerInterval = setInterval(() => {
    for (let i = 0; i < tracks.length; i++) {
      const { key, steps } = tracks[i];
      steps.forEach((step, idx) => {
        step.classList.remove("playing");
        if (idx === currentStep) step.classList.add("playing");
      });

      if (steps[currentStep].classList.contains("active")) {
        toggleAudio(key); // play that pad
      }
    }
    currentStep = (currentStep + 1) % 16;
  }, 300); // 300ms per step
}

function stopSequencer() {
  clearInterval(sequencerInterval);
  currentStep = 0;
  document.querySelectorAll(".step").forEach(step => step.classList.remove("playing"));
}


// Click listeners on drum pads
document.querySelectorAll(".drum-pad").forEach(pad => {
  pad.addEventListener("click", () => {
    const key = pad.getAttribute("data-key");
    playSound(key);
    showDisplay(`Playing pad: ${key}`);
    highlightPad(key);
  });
});

// Visual feedback
function highlightPad(key) {
  const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
  if (pad) {
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 200);
  }
}

// Update display
function showDisplay(message) {
  const display = document.getElementById("display-text");
  if (display) display.textContent = message;
}

// Load Project functionality
function loadProject() {
  alert("Project loaded!");
}

// Sample upload functionality
document.getElementById("upload-sample").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    alert("Sample uploaded: " + file.name);
  }
});

// Handle loop toggle
const loopToggle = document.getElementById("loop-toggle-checkbox");
loopToggle.addEventListener("change", function() {
  if (loopToggle.checked) {
    alert("Loop Mode Enabled");
  } else {
    alert("Loop Mode Disabled");
  }
});
const tracks = ['Kick', 'Snare', 'Hi-Hat', 'Bass', 'Synth'];

function loadTrackFXControls() {
  const container = document.getElementById("track-fx-container");
  container.innerHTML = "";

  tracks.forEach((track, index) => {
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
  // TODO: Link to actual Web Audio API nodes for live FX manipulation
}

function savePreset() {
  alert("Preset saved!");
  // TODO: Save current track FX values to localStorage or JSON
}

function loadPreset() {
  alert("Preset loaded!");
  // TODO: Load saved FX values and apply to UI/audio engine
}

// Initialize when tab is opened or page loads
loadTrackFXControls();

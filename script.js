import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

const display = document.getElementById('display-text');
const drumPads = document.getElementById('drum-pads');
const visualizer = document.getElementById('visualizer');
const loopToggle = document.getElementById('loop-toggle-checkbox');
const fileUpload = document.getElementById('file-upload');
const assignKeyInput = document.getElementById('assign-key');

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
let masterGain = audioCtx.createGain();
masterGain.connect(analyser);
analyser.connect(audioCtx.destination);

// Reverb node
let reverb = audioCtx.createConvolver();
reverb.connect(masterGain);

// SSL-style compressor
let compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.setValueAt(-20);
compressor.knee.setValueAt(30);
compressor.ratio.setValueAt(12);
compressor.attack.setValueAt(0.003);
compressor.release.setValueAt(0.25);
compressor.connect(reverb);

// Audio data
const padData = {
  Q: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  W: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  E: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  A: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  S: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  D: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  Z: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  X: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  C: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
};

let sources = {};
let buffers = {};
let loopMode = false;

function createPad(key) {
  const pad = document.createElement('div');
  pad.className = 'drum-pad';
  pad.innerText = key;
  pad.id = key;

  pad.addEventListener('click', () => handlePlay(key));
  drumPads.appendChild(pad);
}

function handlePlay(key) {
  if (!buffers[key]) return;

  // Stop current if already playing
  if (sources[key]) {
    sources[key].stop();
    sources[key] = null;
    return;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffers[key];
  source.loop = loopToggle.checked;
  source.connect(compressor);
  source.start();

  sources[key] = source;

  display.innerText = `Playing: ${key}`;
}

function fetchBuffer(url, key) {
  fetch(url)
    .then(res => res.arrayBuffer())
    .then(data => audioCtx.decodeAudioData(data))
    .then(buffer => {
      buffers[key] = buffer;
    });
}

function drawVisualizer() {
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const canvasCtx = visualizer.getContext("2d");

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = "#000";
    canvasCtx.fillRect(0, 0, visualizer.width, visualizer.height);
    canvasCtx.fillStyle = "#0f0";
    const barWidth = visualizer.width / bufferLength;
    dataArray.forEach((val, i) => {
      const y = (val / 255) * visualizer.height;
      canvasCtx.fillRect(i * barWidth, visualizer.height - y, barWidth, y);
    });
  }

  draw();
}

fileUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const key = assignKeyInput.value.toUpperCase();
  if (!file || !key) return;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = await audioCtx.decodeAudioData(arrayBuffer);
  buffers[key] = buffer;

  if (!document.getElementById(key)) {
    createPad(key);
  }

  display.innerText = `Assigned ${file.name} to ${key}`;
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

document.getElementById("save-project-btn").addEventListener("click", () => {
  const project = {
    pads: Object.keys(buffers),
    loop: loopToggle.checked,
  };
  localStorage.setItem("drumProject", JSON.stringify(project));
  alert("Project saved locally!");
});

document.getElementById("download-project-btn").addEventListener("click", () => {
  const project = {
    pads: Object.keys(buffers),
    loop: loopToggle.checked,
  };
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "drum-machine-project.json";
  a.click();
});

// Load and draw pads
Object.keys(padData).forEach(key => {
  createPad(key);
  fetchBuffer(padData[key], key);
});

// Visualizer
drawVisualizer();

// Key press
document.addEventListener("keydown", e => {
  const key = e.key.toUpperCase();
  if (buffers[key]) handlePlay(key);
});

// Auth gate
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
});

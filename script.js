<script>
// === User Login/Logout ===
if (!localStorage.getItem("loggedInUser")) {
  window.location.href = "login.html";
}
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// === Global Variables ===
const pads = document.querySelectorAll('.drum-pad');
const display = document.getElementById('display-text');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);
const audioElements = {};
let currentAudio = null;

const convolver = audioContext.createConvolver();
const compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
compressor.knee.setValueAtTime(30, audioContext.currentTime);
compressor.ratio.setValueAtTime(4, audioContext.currentTime);
compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
compressor.release.setValueAtTime(0.25, audioContext.currentTime);

let projectData = {
  pads: [],
  theme: 'light',
  effects: {
    delay: 0.5,
    filter: 0.5,
    bitcrusher: 0.5,
    reverb: 0.5,
    threshold: -24,
    ratio: 4
  }
};

// === Audio Controls ===
function createAudio(key, src) {
  const audio = new Audio(src);
  audio.loop = document.getElementById("loop-toggle-checkbox").checked;
  audioElements[key] = audio;
}

function toggleAudio(key) {
  const audio = audioElements[key];
  const start = parseFloat(document.getElementById("start-time").value) || 0;
  const end = parseFloat(document.getElementById("end-time").value) || audio.duration;

  if (audio.paused) {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    audio.currentTime = start;
    audio.play();
    currentAudio = audio;
    trimAudio(audio, start, end);
    visualizeAudio(audio);
    updateDisplay(`🎵 Playing: ${key}`);
    animatePad(key, true);
  } else {
    audio.pause();
    updateDisplay(`⏹️ Stopped: ${key}`);
    animatePad(key, false);
  }
}

function trimAudio(audio, start, end) {
  audio.currentTime = start;
  audio.addEventListener("timeupdate", function () {
    if (audio.currentTime >= end) {
      audio.pause();
      updateDisplay("⏹️ Reached end of trim");
    }
  });
}

function visualizeAudio(audio) {
  const canvas = document.getElementById("spectrum");
  const ctx = canvas.getContext("2d");

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#00ffc3');
    gradient.addColorStop(1, '#006eff');

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let x = 0;

    dataArray.forEach(value => {
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - value, barWidth, value);
      x += barWidth + 1;
    });

    if (!audio.paused) requestAnimationFrame(draw);
  }

  draw();
}

function animatePad(key, isPlaying) {
  const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
  if (!pad) return;
  pad.classList.remove("playing");
  if (isPlaying) {
    pad.classList.add("playing");
    setTimeout(() => pad.classList.remove("playing"), 300);
  }
}

// === Pad Listeners ===
pads.forEach(pad => {
  pad.addEventListener("click", () => {
    const key = pad.dataset.key;
    toggleAudio(key);
  });
});

// === Sample Upload ===
document.getElementById("file-upload").addEventListener("change", function () {
  const file = this.files[0];
  const key = document.getElementById("assign-key").value;
  if (file && key) {
    const url = URL.createObjectURL(file);
    createAudio(key, url);
    updateDisplay(`✅ Sample assigned to ${key}`);
  }
});

// === Effects Controls ===
document.getElementById("reverb-amount").addEventListener("input", e => {
  projectData.effects.reverb = parseFloat(e.target.value);
});

document.getElementById("compressor-threshold").addEventListener("input", e => {
  const value = parseFloat(e.target.value);
  compressor.threshold.setValueAtTime(value, audioContext.currentTime);
  projectData.effects.threshold = value;
});

document.getElementById("compressor-ratio").addEventListener("input", e => {
  const value = parseFloat(e.target.value);
  compressor.ratio.setValueAtTime(value, audioContext.currentTime);
  projectData.effects.ratio = value;
});

// === Theme ===
const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.toggle("dark", prefersDark);
themeToggle.checked = prefersDark;
projectData.theme = prefersDark ? 'dark' : 'light';

themeToggle.addEventListener("change", function () {
  const isDark = this.checked;
  document.body.classList.toggle("dark", isDark);
  projectData.theme = isDark ? 'dark' : 'light';
});

// === Project Save/Load ===
function saveProject() {
  localStorage.setItem("projectData", JSON.stringify(projectData));
  updateDisplay("💾 Project saved!");
}

function loadProject() {
  const saved = JSON.parse(localStorage.getItem("projectData"));
  if (saved) {
    projectData = saved;
    updateDisplay("📂 Project loaded!");
  } else {
    updateDisplay("⚠️ No saved project found.");
  }
}

// === Step Sequencer ===
function toggleStep(index) {
  const step = document.querySelectorAll(".step")[index];
  step.classList.toggle("active");
}

function playSequencer() {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, i) => {
    if (step.classList.contains("active")) {
      setTimeout(() => {
        playSound(String.fromCharCode(65 + (i % 8)));
      }, i * 500);
    }
  });
}

function playSound(key) {
  if (audioElements[key]) {
    audioElements[key].currentTime = 0;
    audioElements[key].play();
    animatePad(key, true);
  }
}

// === Display Update ===
function updateDisplay(message) {
  display.textContent = message;
  display.classList.add("flash");
  setTimeout(() => display.classList.remove("flash"), 500);
}

// === Default Sounds ===
const defaultSounds = {
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

Object.keys(defaultSounds).forEach(key => createAudio(key, defaultSounds[key]));
</script>

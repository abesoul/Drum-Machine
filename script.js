const display = document.getElementById("display-text");
const pads = document.querySelectorAll(".drum-pad");
const uploadInput = document.getElementById("file-upload");
const assignKey = document.getElementById("assign-key");
const loopToggle = document.getElementById("loop-toggle-checkbox");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

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
// Reverb & Compressor setup
const convolver = audioContext.createConvolver();
const compressor = audioContext.createDynamicsCompressor();

// Setting default compressor settings to emulate SSL Bus Compressor
compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
compressor.knee.setValueAtTime(30, audioContext.currentTime);
compressor.ratio.setValueAtTime(4, audioContext.currentTime);
compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
compressor.release.setValueAtTime(0.25, audioContext.currentTime);

// Initialize audio elements for drum pads
const audioElements = {};
let currentAudio = null;
let currentSource = null;

function createAudio(key, src) {
  const audio = new Audio(src);
  audio.loop = loopToggle.checked;
  audioElements[key] = audio;
}

// Spectrum visualization function
function visualizeAudio(audio) {
  const canvas = document.getElementById("spectrum");
  const canvasCtx = canvas.getContext("2d");

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      canvasCtx.fillStyle = "#00f7ff";
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
    

    if (audio && !audio.paused) {
      requestAnimationFrame(draw);
    }
  }

  draw();
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

// Trim audio logic
function trimAudio(audio, startTime, endTime) {
  audio.currentTime = startTime;
  audio.addEventListener("timeupdate", function () {
    if (audio.currentTime >= endTime) {
      audio.pause();
    }
  });
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Start/Stop logic
function toggleAudio(key) {
  const audio = audioElements[key];
  if (audio.paused) {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    audio.currentTime = startTimeInput.value;
    audio.loop = loopToggle.checked;
    audio.play();
    visualizeAudio(audio);
    currentAudio = audio;
    display.textContent = `Playing: ${key} ${audio.loop ? "(Looping)" : ""}`;
  } else {
    audio.pause();
    display.textContent = `Stopped: ${key}`;
  }
}

// Event listener for key pads
pads.forEach(pad => {
  pad.addEventListener("click", () => {
    const key = pad.dataset.key;
    toggleAudio(key);
  });
});

// Create audio elements for default sounds
const sounds = {
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

for (const key in sounds) {
  createAudio(key, sounds[key]);
}


// Save Project functionality
function saveProject() {
  alert("Project saved!");
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


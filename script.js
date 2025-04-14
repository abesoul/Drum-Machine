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

const audioElements = {};
let currentAudio = null;
let currentSource = null;

// Create audio elements
function createAudio(key, src) {
  const audio = new Audio(src);
  audio.loop = loopToggle.checked; // Default loop state
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

// Trim audio logic
function trimAudio(audio, startTime, endTime) {
  audio.currentTime = startTime;
  audio.addEventListener("timeupdate", function () {
    if (audio.currentTime >= endTime) {
      audio.pause();
    }
  });
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

// Handle file upload and assign to key
uploadInput.addEventListener("change", function () {
  const file = this.files[0];
  const selectedKey = assignKey.value;

  if (file && selectedKey) {
    const url = URL.createObjectURL(file);
    createAudio(selectedKey, url);
    display.textContent = `Sample assigned to ${selectedKey}`;
  } else {
    alert("Select a key and upload a file.");
  }
});

// Loop toggle state update
loopToggle.addEventListener("change", () => {
  const isLooping = loopToggle.checked;
  Object.values(audioElements).forEach(audio => {
    audio.loop = isLooping;
  });
});

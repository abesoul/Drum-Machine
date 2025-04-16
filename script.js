// Variables for the drum machine
const pads = document.querySelectorAll('.drum-pad');
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffers = {};
let currentSound = null;

// Store the project data
let projectData = {
  pads: [],
  effects: {
    delay: 0.5,
    filter: 0.5,
    bitcrusher: 0.5,
  },
  theme: 'light',
};

// Pads functionality: Play sound when clicked
pads.forEach(pad => {
  pad.addEventListener('click', () => {
    const key = pad.getAttribute('data-key');
    if (currentSound) {
      stopSound(currentSound);
    }
    playSound(key);
  });
});

// Function to play the sound assigned to the key
function playSound(key) {
  const audio = new Audio(`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${key.charCodeAt(0) - 64}.mp3`);
  audio.play();
  currentSound = audio;
}

// Stop the sound
function stopSound(audio) {
  audio.pause();
  audio.currentTime = 0;
}

// Show the selected tab
function showTab(tabId) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// Dark mode toggle
function toggleTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  document.body.classList.toggle('dark', themeToggle.checked);
  projectData.theme = themeToggle.checked ? 'dark' : 'light';
}

// Save project
function saveProject() {
  localStorage.setItem('projectData', JSON.stringify(projectData));
  alert('Project saved!');
}

// Load project
function loadProject() {
  const savedData = JSON.parse(localStorage.getItem('projectData'));
  if (savedData) {
    projectData = savedData;
    alert('Project loaded!');
  } else {
    alert('No saved project found.');
  }
}

// Handle file upload for custom samples
document.getElementById('upload-sample').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('audio/')) {
    const reader = new FileReader();
    reader.onload = function () {
      audioContext.decodeAudioData(reader.result, (buffer) => {
        audioBuffers[file.name] = buffer;
        alert('Custom sample uploaded!');
      });
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please upload a valid audio file.');
  }
}

// Assign custom sample to a pad key
document.getElementById('assign-sample-key').addEventListener('change', (event) => {
  const key = event.target.value;
  const sampleName = document.getElementById('upload-sample').files[0]?.name;
  if (key && sampleName) {
    audioBuffers[key] = audioBuffers[sampleName];
    alert(`Sample assigned to ${key}`);
  } else {
    alert('Please upload a sample and select a key.');
  }
});

// Audio effects controls
document.getElementById('delay').addEventListener('input', (event) => {
  projectData.effects.delay = event.target.value;
});
document.getElementById('filter').addEventListener('input', (event) => {
  projectData.effects.filter = event.target.value;
});
document.getElementById('bitcrusher').addEventListener('input', (event) => {
  projectData.effects.bitcrusher = event.target.value;
});

// Visualizer (Audio Spectrum)
const spectrumCanvas = document.getElementById('spectrum');
const spectrumCtx = spectrumCanvas.getContext('2d');
let analyserNode = audioContext.createAnalyser();
analyserNode.fftSize = 256;
analyserNode.smoothingTimeConstant = 0.8;

function updateVisualizer() {
  analyserNode.getByteFrequencyData(new Uint8Array(analyserNode.frequencyBinCount));
  spectrumCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
  const data = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(data);
  spectrumCtx.fillStyle = '#00ff00';
  data.forEach((value, index) => {
    spectrumCtx.fillRect(index * 2, spectrumCanvas.height - value, 2, value);
  });
  requestAnimationFrame(updateVisualizer);
}

// Set up the analyser node and start the visualizer
function startVisualizer() {
  const sourceNode = audioContext.createBufferSource();
  sourceNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);
  updateVisualizer();
}

// Handle the step sequencer clicks
function toggleStep(index) {
  const step = document.querySelectorAll('.step')[index];
  step.classList.toggle('active');
}

// Implement sequencer play/stop functionality
let isSequencerPlaying = false;
function playSequencer() {
  isSequencerPlaying = !isSequencerPlaying;
  if (isSequencerPlaying) {
    // Start playing the steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      if (step.classList.contains('active')) {
        setTimeout(() => {
          playSound(String.fromCharCode(65 + (index % 8))); // Play sound based on index
        }, index * 500); // Delay for each step
      }
    });
  }
}

// Initializer
function init() {
  showTab('pads'); // Start with the pads tab visible
}

init();

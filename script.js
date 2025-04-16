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

// Tab switching functionality
function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => {
    tab.classList.remove("active");
  });

  const activeTab = document.getElementById(tabId);
  activeTab.classList.add("active");
}

// Save Project functionality
function saveProject() {
  alert("Project saved!");
}
// Stock audio sample URLs mapped to keys
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

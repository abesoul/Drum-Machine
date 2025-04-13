// Get all the drum pads
const drumPads = document.querySelectorAll(".drum-pad");

// Get the display area
const display = document.getElementById("display-text");

// Map each key press to a specific audio clip and pad
const soundMapping = {
  Q: "Heater 1",
  W: "Heater 2",
  E: "Heater 3",
  A: "Heater 4",
  S: "Clap",
  D: "Open-HH",
  Z: "Kick-n-Hat",
  X: "Kick",
  C: "Closed-HH"
};

// Add event listeners to each drum pad for click events
drumPads.forEach((pad) => {
  pad.addEventListener("click", () => {
    const key = pad.id;
    document.getElementById(`${key}-audio`).play();
    display.textContent = soundMapping[key];
  });
});

// Add event listener for key press events
document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (soundMapping[key]) {
    document.getElementById(`${key}-audio`).play();
    display.textContent = soundMapping[key];
  }
});

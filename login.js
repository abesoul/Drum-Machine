// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // For simplicity, we'll use a mock user check
  if (username === "admin" && password === "password123") {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html"; // Redirect to main app page
  } else {
    alert("Invalid username or password");
  }
});

// Handle register form submission
document.getElementById("register-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("new-username").value;
  const password = document.getElementById("new-password").value;

  // Save the new user to localStorage (mock registration)
  localStorage.setItem("loggedInUser", username);

  alert("Registration successful! Please login.");

  // Redirect to login page after registration
  window.location.href = "login.html";
});

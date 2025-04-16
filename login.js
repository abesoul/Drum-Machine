// Simulate a "database" using localStorage
const usersDatabase = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const user = usersDatabase.find(user => user.username === username && user.password === password);
  
  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'index.html';
  } else {
    document.getElementById('error-message').style.display = 'block';
  }
});

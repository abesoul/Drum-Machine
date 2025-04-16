const usersDatabase = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const newUsername = document.getElementById('new-username').value;
  const newPassword = document.getElementById('new-password').value;
  
  const userExists = usersDatabase.some(user => user.username === newUsername);
  
  if (userExists) {
    document.getElementById('register-error').style.display = 'block';
  } else {
    usersDatabase.push({ username: newUsername, password: newPassword });
    localStorage.setItem('users', JSON.stringify(usersDatabase));
    alert('Registration successful! You can now login.');
    window.location.href = 'login.html';
  }
});

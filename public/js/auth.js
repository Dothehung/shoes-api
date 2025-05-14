// auth.js
function checkLogin() {
  const user = localStorage.getItem('user');
  if (!user && window.location.pathname !== '/index.html') {
    window.location.href = '/index.html';
  }
}

function login(username) {
  localStorage.setItem('user', JSON.stringify({ username }));
  window.location.href = 'home.html';
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

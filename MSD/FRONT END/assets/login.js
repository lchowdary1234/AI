// Login page logic for login.html
const loginFormPage = document.getElementById('loginFormPage');
if (loginFormPage) {
  loginFormPage.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    if ((user && pass) && (user === 'user' && pass === 'pass')) {
      window.location.href = 'dashboard.html';
    } else {
      loginFormPage.classList.add('shake');
      setTimeout(() => loginFormPage.classList.remove('shake'), 500);
    }
  });
}
// Add shake animation for login error
const style = document.createElement('style');
style.innerHTML = `
  .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
  @keyframes shake {
    10%, 90% { transform: translateX(-2px); }
    20%, 80% { transform: translateX(4px); }
    30%, 50%, 70% { transform: translateX(-8px); }
    40%, 60% { transform: translateX(8px); }
  }
`;
document.head.appendChild(style);

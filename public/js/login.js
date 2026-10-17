const form = document.getElementById('login-form');
const resultEl = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    resultEl.style.display = 'block';
    resultEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    resultEl.style.display = 'block';
    resultEl.textContent = '요청 실패: ' + err.message;
  }
});

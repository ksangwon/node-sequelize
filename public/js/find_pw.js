const form = document.getElementById('find_pw');
const resultEl = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = form.username.value;
  const email = form.email.value;

  try {
    const res = await fetch('/find_pw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });

    const data = await res.json();
    resultEl.style.display = 'block';
    resultEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    resultEl.style.display = 'block';
    resultEl.textContent = '요청 실패: ' + err.message;
  }
});
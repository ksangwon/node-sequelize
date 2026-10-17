const API = '/users';
const listEl = document.getElementById('user-list');
const formEl = document.getElementById('user-form');
const messageEl = document.getElementById('message');


async function loadUsers() {
  const res = await fetch(API);          
  const users = await res.json();

  listEl.innerHTML = '';

  if (users.length === 0) {
    listEl.innerHTML = '<li class="empty">아직 등록된 사용자가 없습니다.</li>';
    return;
  }

  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${user.name}</strong> <span class="email">${user.email}</span></span>
      <button data-id="${user.id}">삭제</button>
    `;
    listEl.appendChild(li);
  });
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  const res = await fetch(API, {           // POST /users
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });

  if (res.ok) {
    messageEl.textContent = '추가되었습니다';
    messageEl.className = 'message success';
    formEl.reset();
    loadUsers(); // 목록 새로고침
  } else {
    const err = await res.json();
    messageEl.textContent = '실패: ' + (err.error || '알 수 없는 오류');
    messageEl.className = 'message error';
  }
});

listEl.addEventListener('click', async (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  const id = e.target.dataset.id;
  await fetch(`${API}/${id}`, { method: 'DELETE' }); 
  loadUsers();
});

loadUsers();

require('dotenv').config();
const path = require('path');
const express = require('express');
const { sequelize } = require('./models');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/users', usersRouter);

async function connectWithRetry(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('DB 연결 성공');
      return;
    } catch (err) {
      console.log(`DB 연결 재시도 ${i}/${retries}... (${err.message})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('DB 연결 실패: 재시도 횟수를 초과했습니다.');
}

async function start() {
  try {
    await connectWithRetry();
    await sequelize.sync();
    console.log('모델 동기화 완료');

    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('시작 실패:', err.message);
    process.exit(1);
  }
}

start();

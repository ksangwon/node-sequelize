require('dotenv').config();
const path = require('path');
const express = require('express');
const sequelize = require('./config/database');
const seed = require('./seed');
const authRouter = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', authRouter);

async function connectWithRetry(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (err) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('DB 연결 실패');
}

async function start() {
  try {
    await connectWithRetry();
    await sequelize.sync();
    await seed();
    app.listen(PORT, () => {});
  } catch (err) {
    process.exit(1);
  }
}

start();

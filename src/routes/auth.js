const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/user');

const { literal, Op } = Sequelize;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  let capturedSql = '';

  try {
    const users = await User.findAll({
      where: {
        username: username,
        [Op.and]: literal('password = :pw'),
      },
      replacements: { pw: password },
      logging: (sql) => { capturedSql = sql; },
    });

    res.json({
      input: { username, password },
      generatedSql: capturedSql,
      matchedCount: users.length,
      matchedUsers: users.map((u) => ({ id: u.id, username: u.username })),
      loginSuccess: users.length > 0,
    });
  } catch (err) {
    res.status(500).json({
      input: { username, password },
      generatedSql: capturedSql,
      error: err.message,
    });
  }
});

router.post('/find_pw', async (req, res) => {
  const { username, email } = req.body;
  let capturedSql = '';
  try {
    const users = await User.findAll({
      where: {
        username: username,
        [Op.and]: literal('email = :em'),
      },
      replacements: { em: email },
      logging: (sql) => { capturedSql = sql; },
    });

    if (users.length > 0) {
      res.json({
        input: { username, email },
        generatedSql: capturedSql,
        found: true,
        password: users[0].password,
        message: `비밀번호: ${users[0].password}`,
      });
    } else {
      res.json({
        input: { username, email },
        generatedSql: capturedSql,
        found: false,
        message: '일치하는 계정이 없습니다.',
      });
    }
  } catch (err) {
    res.status(500).json({
      input: { username, email },
      generatedSql: capturedSql,
      error: err.message,
    });
  }
});

module.exports = router;

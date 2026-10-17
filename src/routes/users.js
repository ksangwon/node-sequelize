const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  res.json(user);
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  res.status(204).send();
});

module.exports = router;

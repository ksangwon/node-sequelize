const User = require('./models/user');

async function seed() {
  await User.findOrCreate({
    where: { username: 'admin' },
    defaults: { password: 'admin123', name: 'Admin', email: 'admin@test.com' },
  });
  await User.findOrCreate({
    where: { username: 'user1' },
    defaults: { password: 'user123', name: '홍길동', email: 'user1@test.com' },
  });
}

module.exports = seed;

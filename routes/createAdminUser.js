const bcrypt = require('bcrypt');
const db = require('../config/db');

const username = 'admin';
const plainPassword = 'admin123';

(async () => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    console.log('Użytkownik admin został dodany.');
    process.exit();
  } catch (err) {
    console.error('Błąd przy tworzeniu użytkownika:', err);
    process.exit(1);
  }
})();

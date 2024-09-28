const Database = require('better-sqlite3');
const db = new Database('users.db');

// Initialize the database
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
  )
`).run();

// Insert a default user if the table is empty
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (userCount === 0) {
  db.prepare('INSERT INTO users (username, email, phone) VALUES (?, ?, ?)')
    .run('周溢琛', 'yichen0294@gamil.com', '18801381994');
}

// Fetch user profile
const getUserProfile = () => {
  return db.prepare('SELECT * FROM users LIMIT 1').get();
};

// Update user profile
const updateUserProfile = (id, username, email, phone) => {
  return db.prepare('UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?')
    .run(username, email, phone, id);
};

module.exports = {
  getUserProfile,
  updateUserProfile
};

const Database = require('better-sqlite3');
const db = new Database('users.db');

// Create table & init
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
    .run('小胖185', 'yichen0294@gmail.com', '18801381994');
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
  
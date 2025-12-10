const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../users.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Users table ready');
      seedTestUser();
    }
  });
}

function seedTestUser() {
  const testEmail = 'test@example.com';
  const testPassword = 'test123';
  
  db.get('SELECT * FROM users WHERE email = ?', [testEmail], (err, row) => {
    if (err) {
      console.error('Error checking test user:', err);
      return;
    }
    
    if (!row) {
      const passwordHash = bcrypt.hashSync(testPassword, 10);
      db.run(
        'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)',
        ['Test User', testEmail, passwordHash],
        (err) => {
          if (err) {
            console.error('Error inserting test user:', err);
          } else {
            console.log('Test user created: test@example.com / test123');
          }
        }
      );
    }
  });
}

module.exports = db;

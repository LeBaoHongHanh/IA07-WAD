const db = require('./db');
const bcrypt = require('bcryptjs');

const userService = {
  // Tìm user theo email
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Tìm user theo id
  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Tạo user mới
  create: (name, email, password) => {
    return new Promise((resolve, reject) => {
      const passwordHash = bcrypt.hashSync(password, 10);
      db.run(
        'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)',
        [name, email, passwordHash],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              reject(new Error('Email already exists'));
            } else {
              reject(err);
            }
          } else {
            resolve({
              id: this.lastID,
              name,
              email,
            });
          }
        }
      );
    });
  },

  // Kiểm tra password
  verifyPassword: (password, passwordHash) => {
    return bcrypt.compareSync(password, passwordHash);
  }
};

module.exports = userService;

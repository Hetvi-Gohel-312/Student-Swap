const db = require('../config/database');

class User {
  static create(user, callback) {
    const { username, email, password } = user;
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(query, [username, email, password], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  static findByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  static findById(id, callback) {
    db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id], callback);
  }
}

module.exports = User;
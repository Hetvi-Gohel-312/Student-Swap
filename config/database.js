const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL
  )`);

  // Listings table
  db.run(`CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category_id INTEGER,
    user_id INTEGER,
    image_url TEXT,
    location TEXT,
    is_free INTEGER DEFAULT 0,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Insert default categories if they don't exist
  const defaultCategories = [
    { name: 'Textbooks', icon: 'fas fa-book' },
    { name: 'Electronics', icon: 'fas fa-laptop' },
    { name: 'Furniture', icon: 'fas fa-couch' },
    { name: 'Clothing', icon: 'fas fa-tshirt' },
    { name: 'Entertainment', icon: 'fas fa-gamepad' },
    { name: 'Free Stuff', icon: 'fas fa-gift' }
  ];

  defaultCategories.forEach(category => {
    db.get('SELECT id FROM categories WHERE name = ?', [category.name], (err, row) => {
      if (!row) {
        db.run('INSERT INTO categories (name, icon) VALUES (?, ?)', [category.name, category.icon]);
      }
    });
  });
}

module.exports = db;
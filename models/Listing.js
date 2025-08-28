const db = require('../config/database');

class Listing {
  static getAll(callback) {
    const query = `
      SELECT listings.*, categories.name as category_name, users.username 
      FROM listings 
      JOIN categories ON listings.category_id = categories.id 
      JOIN users ON listings.user_id = users.id 
      ORDER BY listings.created_at DESC
    `;
    db.all(query, callback);
  }

  static getById(id, callback) {
    const query = `
      SELECT listings.*, categories.name as category_name, users.username 
      FROM listings 
      JOIN categories ON listings.category_id = categories.id 
      JOIN users ON listings.user_id = users.id 
      WHERE listings.id = ?
    `;
    db.get(query, [id], callback);
  }

  static create(listing, callback) {
    const { title, description, price, category_id, user_id, image_url, location, is_free } = listing;
    const query = `
      INSERT INTO listings (title, description, price, category_id, user_id, image_url, location, is_free) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [title, description, price, category_id, user_id, image_url, location, is_free ? 1 : 0], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  static getByCategory(categoryId, callback) {
    const query = `
      SELECT listings.*, categories.name as category_name, users.username 
      FROM listings 
      JOIN categories ON listings.category_id = categories.id 
      JOIN users ON listings.user_id = users.id 
      WHERE category_id = ? 
      ORDER BY listings.created_at DESC
    `;
    db.all(query, [categoryId], callback);
  }
}

module.exports = Listing;
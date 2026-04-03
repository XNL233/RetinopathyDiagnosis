const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { username, password, email, phone, identityCard } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, email, phone, identity_card) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, phone, identityCard]
    );
    
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, phone, identity_card, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const { username, email, phone, identityCard } = userData;
    
    const [result] = await pool.execute(
      'UPDATE users SET username = ?, email = ?, phone = ?, identity_card = ? WHERE id = ?',
      [username, email, phone, identityCard, id]
    );
    
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
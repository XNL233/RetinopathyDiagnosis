const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('数据库创建成功');

    await connection.end();

    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        identity_card VARCHAR(18),
        role ENUM('doctor', 'admin') DEFAULT 'doctor',
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('用户表创建成功');

    await dbConnection.end();
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    process.exit(1);
  }
};

module.exports = initDatabase;
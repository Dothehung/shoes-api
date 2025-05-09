const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// File tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Log biến môi trường trước
console.log("Connecting to MySQL with:", {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  port: process.env.MYSQLPORT
});

// Kết nối DB
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error("❌ Lỗi kết nối:", err);
    process.exit(1);
  }
  console.log('✅ Đã kết nối với MySQL!');

  db.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(255),
      price INT,
      quantity INT
    )`, () => {});

  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255)
    )`, () => {});
});

// Các API giống bạn đã viết (register, login, cart...)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

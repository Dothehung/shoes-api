const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

// Kết nối với MySQL dùng biến môi trường
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

console.log("Connecting to MySQL with:", {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  port: process.env.MYSQLPORT
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Đã kết nối với MySQL Workbench!');

    // Tạo bảng cart nếu chưa có
    const createCartTable = `
        CREATE TABLE IF NOT EXISTS cart (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            price INT NOT NULL,
            quantity INT NOT NULL
        )
    `;
    db.query(createCartTable, err => {
        if (err) throw err;
        console.log('🛒 Bảng cart đã được tạo hoặc đã tồn tại.');
    });

    // Tạo bảng users nếu chưa có
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;
    db.query(createUsersTable, err => {
        if (err) throw err;
        console.log('👤 Bảng users đã được tạo hoặc đã tồn tại.');
    });
});

// ====== CÁC API ======

app.post('/register', (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const hashedPassword = password; // Có thể thay bằng bcrypt
    const sql = 'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)';
    db.query(sql, [fullname, email, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Email đã tồn tại hoặc lỗi máy chủ" });
        }
        res.json({ message: "Đăng ký thành công!" });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        res.json({ message: "Đăng nhập thành công", user: results[0] });
    });
});

app.get('/cart', (req, res) => {
    db.query('SELECT * FROM cart', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/cart', (req, res) => {
    const { product_name, price, quantity } = req.body;
    if (quantity <= 0) {
        return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
    }
    const sql = 'INSERT INTO cart (product_name, price, quantity) VALUES (?, ?, ?)';
    db.query(sql, [product_name, price, quantity], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Thêm sản phẩm thành công', id: result.insertId });
    });
});

app.put('/cart/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity === 0) {
        db.query('DELETE FROM cart WHERE id = ?', [id], (err) => {
            if (err) throw err;
            res.json({ message: 'Sản phẩm đã được xóa vì số lượng bằng 0' });
        });
    } else {
        const sql = 'UPDATE cart SET quantity = ? WHERE id = ?';
        db.query(sql, [quantity, id], (err) => {
            if (err) throw err;
            res.json({ message: 'Cập nhật số lượng thành công' });
        });
    }
});

app.delete('/cart/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cart WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Xóa sản phẩm thành công' });
    });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));

// Route hiển thị giao diện người dùng
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/register.html'));
});

// 🔧 Sửa lại route hiển thị giao diện giỏ hàng (tránh trùng với API /cart)
app.get('/cart-ui', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

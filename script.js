// const express=require("express");
// const mysql=require("mysql");

// const port =8888;

// const app=express();

// app.get("/",(req,res)=>{
//     res.status(200).send("<h1>a<h1>");
// });

// app.listen(port,(err) => {
//     if(err){
//         console.error("err",err.stack);
//         throw err;
//     }
//     console.log();

// });

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const port = 8888;
const app = express();
const secretKey = 'your_secret_key';
const adminEmail = 'admin@admin.com';
const adminPassword = 'ift3225';

// 使用 body-parser 中间件解析 JSON 数据
app.use(bodyParser.json());

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 设置数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tp2'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// 注册用户
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // 检查电子邮件是否已存在
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        connection.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
        [username, email, hashedPassword, role || 'user'], (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ message: 'User registered' });
        });
    });
});

// 用户登录
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // 管理员登录
    if (email === adminEmail && password === adminPassword) {
        const adminToken = jwt.sign({ id: 0, role: 'admin' }, secretKey, { expiresIn: '1h' });
        return res.json({ token: adminToken });
    }

    // 普通用户登录
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
});

// 获取所有任务（需要身份验证）
app.get('/tasks', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 中间件：验证JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// 启动服务器
app.listen(port, (err) => {
    if (err) {
        console.error('err', err.stack);
        throw err;
    }
    console.log(`Server is running on port ${port}`);
});


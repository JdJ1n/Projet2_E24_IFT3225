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
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


const port = 8888;
const app = express();
const secretKey = 'your_secret_key';
const adminEmail = 'admin@admin.com';
const adminPassword = 'ift3225';
const server = require('http').createServer(app);
const io = socketIo(server);

// 启用所有来源的 CORS 请求
app.use(cors())
// 使用 body-parser 中间件解析 JSON 数据
app.use(bodyParser.json());

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "assets" directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 设置数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'yilin_tp2'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

//add router
// 路由配置
// Route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for user_page2.html
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user_page2.html'));
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

//------------------------------------------------serach part----------------------------------
function getColumnFromAttr(attr) {
    switch (attr) {
        // case '2':
        //     return 'user_id';
        case '3':
            return 'category_id';
        case '4':
            return 'name';
        case '5':
            return 'artist';
        case '6':
            return 'description';
        default:
            return 'name'; // Default column
    }
} 

app.get('/api/cardssea', (req, res) => {
    const serachData = req.query;
    const method = serachData.method;
    const attr = serachData.attr;
    const search = serachData.search;
    let query = 'SELECT * FROM card';
    let queryParams = [];
    
    console.log("=======================")
    console.log(`Received query params - Search: ${search}, Method: ${method}, Attr: ${attr}`);
    
    if (method && attr && search ) {
        const searchColumn = getColumnFromAttr(attr);
        
        if (method === '1') { // Exact match
            query += ` WHERE ${searchColumn} = ?`;
            queryParams.push(search);
        } else if (method === '2') { // Fuzzy search
            query += ` WHERE ${searchColumn} LIKE ?`;
            queryParams.push(`%${search}%`);
        }
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching cards:', err.message);
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
});



//-------------------------------------------ajout
//liste tous les cartes
app.get('/api/cards', (req, res) => {
    connection.query('SELECT * FROM card', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

// //return a specifie card
// app.get('/api/cards/:id', (req, res) => {
//     const cardId = req.params.id;
//     connection.query('SELECT * FROM card WHERE id = ?', [cardId], (err, results) => {
//         if (err) return res.status(500).json({ message: err.message });
//         if (results.length === 0) return res.status(404).json({ message: 'Card not found' });
//         res.json(results[0]);
//     });
// });


// //delete card
// app.delete('/api/cards/:id', (req, res) => {
//     const cardId = req.params.id;
//     connection.query('DELETE FROM card WHERE id = ?', [cardId], (err, results) => {
//         if (err) return res.status(500).json({ message: err.message });
//         if (results.affectedRows === 0) return res.status(404).json({ message: 'Card not found' });
//         res.json({ message: 'Card deleted successfully' });

//         // 广播卡片删除事件
//         io.emit('cardDeleted', cardId);
//     });
// });

// 添加卡片--------------------------------------------------------------------------------------
app.post('/api/cardstest', (req, res) => {
    // const cardData = {
    //     name: 'Test Album',
    //     artist: 'Test Artist',
    //     category_id: 1,
    //     user_id: 3,
    //     date: '2023-07-18',
    //     description: 'Test description',
    //     url: 'https://example.com/image.jpg'
    // };

    // const query = 'INSERT INTO card (name, artist, category_id, user_id, date, description, url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    // const values = [cardData.name, cardData.artist, cardData.category_id, cardData.user_id, cardData.date, cardData.description, cardData.url];

    // connection.query(query, values, (err, results) => {
    //     if (err) {
    //         console.error('Error inserting data:', err);
    //         res.status(500).json({ message: 'Error inserting data' });
    //         return;
    //     }
    //     console.log('Card added, ID:', results.insertId);
    //     res.status(200).json({ message: 'Card added', id: results.insertId });
    // });
    //-------------------------------------------------------------
    const cardData = req.body;
    // if (!name || !artist || !category_id || !user_id || !date || !url) {
    //     return res.status(400).json({ message: 'All fields except description are required' });
    // }
    const query = 'INSERT INTO card (name, artist, category_id, user_id, date, description, url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [cardData.name, cardData.artist, cardData.category_id, cardData.user_id, cardData.date, cardData.description, cardData.url];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ message: 'Error inserting data' });
            return;
        }
        console.log('Card added, ID:', results.insertId);
        res.status(201).json({ message: 'Card added', cardId: results.insertId });

        // Broadcast card added event
        // io.emit('cardAdded', { id: results.insertId, name, artist, category_id, user_id, date, description, url });
    });
});

// //update (edit)card
// app.put('/api/cards/:id', (req, res) => {
//     const cardId = req.params.id;
//     const { name, artist, category_id, user_id, date, description, url } = req.body;

//     // 检查必需的字段
//     if (!name || !artist || !category_id || !user_id || !date || !url) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     // 更新卡片信息
//     connection.query(
//         'UPDATE card SET name = ?, artist = ?, category_id = ?, user_id = ?, date = ?, description = ?, url = ? WHERE id = ?',
//         [name, artist, category_id, user_id, date, description, url, cardId],
//         (err, results) => {
//             if (err) return res.status(500).json({ message: err.message });
//             if (results.affectedRows === 0) return res.status(404).json({ message: 'Card not found' });
//             res.json({ message: 'Card updated successfully' });

//             // 广播卡片更新事件
//             io.emit('cardUpdated', { id: cardId, name, artist, category_id, user_id, date, description, url });
//         }
//     );
// });



// 启动服务器
app.listen(port, (err) => {
    if (err) {
        console.error('err', err.stack);
        throw err;
    }
    console.log(`Server is running on port ${port}`);
});


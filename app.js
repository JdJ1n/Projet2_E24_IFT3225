const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = 'your_secret_key';
const adminEmail = 'admin@admin.com';
const adminPassword = 'ift3225';

app.use(express.static('public'));

app.use(bodyParser.json());

// static html file
app.use(express.static(path.join(__dirname, 'public')));

// db connection
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

// register
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // check if email already registered
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

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //admin login
    if (email === adminEmail && password === adminPassword) {
        const adminToken = jwt.sign({ id: 0, role: 'admin' }, secretKey, { expiresIn: '1h' });
        return res.json({ token: adminToken });
    }

    // users login
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
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

// acquire card
app.get('/card', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM task WHERE user_id = ?', [req.user.id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// get random cards
app.get('/random-cards', (req, res) => {
    connection.query('SELECT * FROM card ORDER BY RAND() LIMIT 5', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

// jwt auth
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// start server
app.listen(PORT, (err) => {
    if (err) {
        console.error('err', err.stack);
        throw err;
    }
    console.log(`Server is running on port ${PORT}`);
});



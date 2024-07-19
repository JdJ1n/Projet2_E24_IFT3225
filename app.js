require("dotenv").config();
const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise instead of mysql2
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

app.use(express.static('public'));

app.use(bodyParser.json());

// static html file
app.use(express.static(path.join(__dirname, 'public')));

// db connection
const pool = mysql.createPool({ // Use createPool instead of createConnection
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// register
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // check if email already registered
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
    [username, email, hashedPassword, role || 'user']);
    res.status(201).json({ message: 'User registered' });
});

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Login failed: All fields are required');
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        console.log('Login failed: User not found');
        return res.status(400).json({ message: 'User not found' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        console.log('Login failed: Invalid password');
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id,name:user.username, role: user.role }, secretKey, { expiresIn: '1h' });
    // Save the token in the database
    await pool.query('UPDATE users SET authToken = ? WHERE id = ?', [token, user.id]);
    console.log('Login successful:', user);
    res.json({ token });
});

// logout
app.post('/logout', authenticateToken, async (req, res) => {
    try {
        // Remove the token from the database
        await pool.query('UPDATE users SET authToken = NULL WHERE id = ?', [req.user.id]);
        console.log('Logout successful:', req.user);
        res.json({ message: 'User logged out' });
    } catch (err) {
        console.log('Logout failed:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// user page
app.get('/user_page', authenticateToken, async (req, res) => {
    try {
        // If the user is authenticated and their role is 'user', send an OK status
        res.status(200).json({ message: 'OK' });
    } catch (err) {
        console.error('Failed to load user page:', err.message);
        res.status(500).json({ message: err.message });
    }
});


// acquire card
app.get('/card', authenticateToken, async (req, res) => {
    const [tasks] = await pool.query('SELECT * FROM task WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
});

// get random cards
app.get('/cards', async (req, res) => {
    const [cards] = await pool.query('SELECT * FROM card ORDER BY RAND() LIMIT 15');
    res.json(cards);
});

// random cards for index.html
app.get('/random-cards', async (req, res) => {
    const query = `
        SELECT card.*, category.name AS category_name, users.email AS user_email
        FROM card
        JOIN category ON card.category_id = category.id
        JOIN users ON card.user_id = users.id
        ORDER BY RAND() 
        LIMIT 15
    `;

    const [cards] = await pool.query(query);
    res.json(cards);
});

// jwt auth
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, async (err, user) => {
        if (err) return res.sendStatus(403);
        // Check if the token exists in the database
        const [users] = await pool.query('SELECT * FROM users WHERE id = ? AND authToken = ?', [user.id, token]);
        if (users.length === 0) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// clear tokens
app.post('/clear-tokens', async (req, res) => {
    try {
        // Clear all authTokens in the database
        await pool.query('UPDATE users SET authToken = NULL');
        console.log('All authTokens cleared');
        res.json({ message: 'All authTokens cleared' });
    } catch (err) {
        console.error('Failed to clear authTokens:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
});

// start server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Server failed to start:', err.stack);
        return;
    }
    console.log(`Server is running on port ${PORT}`);
});

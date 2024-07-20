require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../services/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentification = require('../middlewares/auth');
const secretKey=process.env.SECRET_KEY;

// register
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // check if email already registered
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
    [username, email, hashedPassword, role || 'user']);
    res.status(201).json({ message: 'User registered' });
});

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Login failed: All fields are required');
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
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

    const token = jwt.sign({ id: user.id, name:user.username, role: user.role }, secretKey, { expiresIn: '24h' });
    // Save the token in the database
    await db.query('UPDATE users SET authToken = ? WHERE id = ?', [token, user.id]);

    // Retrieve the user from the database again
    const [updatedUsers] = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
    const updatedUser = updatedUsers[0];

    console.log('Login successful:', updatedUser);
    res.json({ token });
});

// logout
router.post('/logout', authentification, async (req, res) => {
    try {
        // Remove the token from the database
        await db.query('UPDATE users SET authToken = NULL WHERE id = ?', [req.user.id]);
        console.log('Logout successful:', req.user);
        res.json({ message: 'User logged out' });
    } catch (err) {
        console.log('Logout failed:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// clear tokens
router.post('/clear-tokens', async (req, res) => {
    try {
        // Clear all authTokens in the database
        await db.query('UPDATE users SET authToken = NULL');
        console.log('All authTokens cleared');
        res.json({ message: 'All authTokens cleared' });
    } catch (err) {
        console.error('Failed to clear authTokens:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.get('/user_page', authentification, async (req, res) => {
    try {
        // Check if the user is authenticated and their role is 'user'
        if (req.user.role == 'user'||'admin') {
            res.status(200).json({ message: 'OK' });
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (err) {
        console.error('Failed to load user page:', err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

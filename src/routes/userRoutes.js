require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../services/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentification = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const secretKey = process.env.SECRET_KEY;

// register
router.post('/register', asyncHandler(async (req, res) => {
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
}));

//login
router.post("/login", asyncHandler(async (req, res) => {
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

    const token = jwt.sign({ id: user.id, name: user.username, role: user.role }, secretKey, { expiresIn: '24h' });
    await db.query('UPDATE users SET authToken = ? WHERE id = ?', [token, user.id]);

    const [updatedUsers] = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
    const updatedUser = updatedUsers[0];

    console.log('Login successful:', updatedUser);
    res.json({ token });
}));

// logout
router.post('/logout', authentification, asyncHandler(async (req, res) => {
    // Remove the token from the database
    await db.query('UPDATE users SET authToken = NULL WHERE id = ?', [req.user.id]);
    console.log('Logout successful:', req.user);
    res.json({ message: 'User logged out' });
}));

// get active user
router.get('/active_user', authentification, asyncHandler(async (req, res) => {
    console.log("Active User", req.user);
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json(users[0]);
}));

// clear tokens
router.post('/clear_all_tokens', asyncHandler(async (req, res) => {
    // Clear all authTokens in the database
    await db.query('UPDATE users SET authToken = NULL');
    console.log('All authTokens cleared');
    res.json({ message: 'All authTokens cleared' });
}));

router.get('/user_page', authentification, asyncHandler(async (req, res) => {
    // Check if the user is authenticated and their role is 'user'
    if (req.user.role === 'user' || req.user.role === 'admin') {
        res.status(200).json({ message: 'OK' });
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
}));

module.exports = router;

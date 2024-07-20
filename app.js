require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/routes/userRoutes');
const cardRoutes = require('./src/routes/cardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/card', cardRoutes);

// jwt auth
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, async (err, user) => {
        if (err) return res.sendStatus(403);
        // Check if the token exists in the database
        const [users] = await db.query('SELECT * FROM users WHERE id = ? AND authToken = ?', [user.id, token]);
        if (users.length === 0) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

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

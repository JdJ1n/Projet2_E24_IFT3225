require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/routes/userRoutes');
const cardRoutes = require('./src/routes/cardRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/card', cardRoutes);
app.use('/cate', categoryRoutes);

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

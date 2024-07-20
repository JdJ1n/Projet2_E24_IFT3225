require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../services/mysql');
const authentification = require('../middlewares/auth');

/*// acquire card
router.get('/card', authenticateToken, async (req, res) => {
    const [tasks] = await db.query('SELECT * FROM task WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
});*/

// get random cards
router.get('/cards', async (req, res) => {
    const [cards] = await db.query('SELECT * FROM card ORDER BY RAND() LIMIT 15');
    res.json(cards);
});

// random cards for index.html
router.get('/random-cards', async (req, res) => {
    const query = `
        SELECT card.*, category.name AS category_name, users.email AS user_email
        FROM card
        JOIN category ON card.category_id = category.id
        JOIN users ON card.user_id = users.id
        ORDER BY RAND() 
        LIMIT 15
    `;

    const [cards] = await db.query(query);
    res.json(cards);
});

module.exports = router;

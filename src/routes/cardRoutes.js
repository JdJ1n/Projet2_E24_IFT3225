require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../services/mysql');
const authentification = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

/*// acquire card
router.get('/card', authenticateToken, async (req, res) => {
    const [tasks] = await db.query('SELECT * FROM task WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
});*/


// get one's cards
router.get('/user_cards',authentification, asyncHandler(async (req, res) => {
    const query = `
        SELECT card.*, category.name AS category_name, users.email AS user_email
        FROM card 
        JOIN category ON card.category_id = category.id
        JOIN users ON card.user_id = users.id
        WHERE card.user_id = ?
    `;
    const [cards] = await db.query(query,[req.user.id]);
    res.json(cards);
}));


// random 15 cards for index.html
router.get('/random_cards', asyncHandler(async (req, res) => {
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
}));

//get all cards
router.get('/all_cards',authentification, asyncHandler(async (req, res) => {
    const query = `
        SELECT card.*, category.name AS category_name, users.email AS user_email
        FROM card
        JOIN category ON card.category_id = category.id
        JOIN users ON card.user_id = users.id
    `;

    const [cards] = await db.query(query);
    res.json(cards);
}));


module.exports = router;

require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../services/mysql');
const authentification = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');


// get one's cards
router.get('/user_cards', authentification, asyncHandler(async (req, res) => {
    const query = `
        SELECT card.*, category.name AS category_name, users.email AS user_email
        FROM card 
        JOIN category ON card.category_id = category.id
        JOIN users ON card.user_id = users.id
        WHERE card.user_id = ?
    `;
    const [cards] = await db.query(query, [req.user.id]);
    res.json(cards);
}));

router.post('/add_card', authentification, asyncHandler(async (req, res) => {
    const cardData = req.body;
    const query = 'INSERT INTO card (name, artist, category_id, user_id, date, description, url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [cardData.name, cardData.artist, cardData.category_id, cardData.user_id, cardData.date, cardData.description, cardData.url];

    db.query(query, values, (err, results) => {
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
router.get('/all_cards', authentification, asyncHandler(async (req, res) => {
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

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

router.post('/add_card', authentification, async (req, res) => {
    const cardData = req.body;
    const query = 'INSERT INTO card (name, artist, category_id, user_id, date, description, url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [cardData.name, cardData.artist, cardData.category_id, cardData.user_id, cardData.date, cardData.description, cardData.url];
    const [result] = await db.query(query, values); 
    if(result.affectedRows > 0){
        res.json({message: "Card added successfully", cardId: result.insertId});
    } else {
        res.status(500).json({message: "Error adding card"});
    }
});

router.put('/edit_card', authentification, async (req, res) => {
    const cardData = req.body;
    const query = 'UPDATE card SET name = ?, artist = ?, category_id = ?, user_id = ?, date = ?, description = ?, url = ? WHERE id = ?';
    const values = [cardData.name, cardData.artist, cardData.category_id, cardData.user_id, cardData.date, cardData.description, cardData.url, cardData.id];
    const [result] = await db.query(query, values);
    if(result.affectedRows > 0){
        res.json({message: "Card updated successfully"});
    } else {
        res.status(500).json({message: "Error updating card"});
    }
});

router.delete('/delete_card', authentification, async (req, res) => {
    const cardData = req.body;
    const query = 'DELETE FROM card WHERE id = ?';
    const values = [cardData.id];
    const [result] = await db.query(query, values);
    console.log(result);
    if(result.affectedRows > 0){
        res.json({message: "Card deleted successfully"});
    } else {
        res.status(500).json({message: "Error deleting card"});
    }
});



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

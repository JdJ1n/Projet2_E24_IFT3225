require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../services/mysql');
const asyncHandler = require('../middlewares/asyncHandler');

// get all categories
router.get('/all_categories', asyncHandler(async (req, res) => {
    const query = `
        SELECT category.* FROM category
    `;
    const [categories] = await db.query(query);
    res.json(categories);
}));

module.exports = router;

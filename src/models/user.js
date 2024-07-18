require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const User = {
    findUser: async (email, password) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            throw new Error("Erreur : Le compte n'existe pas !");
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Erreur : Le mot de passe n'est pas valide !");
        }

        delete user.password;
        return user;
    },

    generateAuthTokenAndSaveUser: async function(user) {
        const authToken = jwt.sign({ id: user.id.toString() }, process.env.PHRASE_PASS);
        await pool.query('UPDATE users SET authToken = ? WHERE id = ?', [authToken, user.id]);
        return authToken;
    }
};

module.exports = User;

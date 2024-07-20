require("dotenv").config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

console.log(`Connected to database at host ${process.env.DB_HOST} on port ${process.env.DB_PORT}`);

pool.on('connect', (connection) => {
    console.log(`Connected to database with ID ${connection.threadId} at ${new Date()}`);
});

pool.on('acquire', (connection) => {
    console.log(`Connection ${connection.threadId} acquired at ${new Date()}`);
});

pool.on('release', (connection) => {
    console.log(`Connection ${connection.threadId} released at ${new Date()}`);
});

pool.on('enqueue', () => {
    console.log(`Waiting for available connection slot at ${new Date()}`);
});

pool.on('error', (err) => {
    console.error(`Database error: ${err.message}`);
});

module.exports = {
    query: async (text, params) => {
        console.log(`Executing SQL query: ${text}`);
        if (params && params.length) {
            console.log(`With parameters: ${params}`);
        }
        return pool.query(text, params);
    },
};



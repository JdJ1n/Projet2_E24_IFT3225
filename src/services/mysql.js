require("dotenv").config();
const mysql = require("mysql2");

async function connectDB() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    connection.connect((err) => {
        if (err) throw err;
        console.log("MySQL connected！");
    });

    return connection;
}

module.exports = {
    connectDB
}

const jwt = require('jsonwebtoken');
const db = require('../services/mysql');

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header("Authorization").replace("Bearer ", "");
        try {
            const decodedToken = jwt.verify(authToken, process.env.SECRET_KEY);
            const [users] = await db.query('SELECT * FROM users WHERE id = ? AND authToken = ?', [decodedToken.id, authToken]);
            if (!users) {
                throw new Error("L'utilisateur n'existe pas");
            }
            req.authToken = authToken;
            req.user = users[0];
            next();
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                await db.query('UPDATE users SET authToken = NULL WHERE authToken = ?', [authToken]);
                res.status(401).send("Your session has expired. Please log in again.");
            } else {
                throw e;
            }
        }
    } catch (e) {
        res.status(401).send("Merci de vous authentifier");
    }
};
module.exports = authentification;

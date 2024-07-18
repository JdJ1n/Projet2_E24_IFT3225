require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header("Authorization").replace("Bearer ", "");
        const decodedToken = jwt.verify(authToken, process.env.PHRASE_PASS);
        const user = await User.findUserByIdAndToken(decodedToken.id, authToken);
        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }
        req.authToken = authToken;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("Merci de vous authentifier");
    }
};

module.exports = authentification;

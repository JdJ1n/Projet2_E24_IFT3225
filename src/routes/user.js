const express = require("express");
const User = require("../models/user");
const authentification = require("../middlewares/authentification");
const router = new express.Router();

router.post("/users", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        const user = await User.findUser(email, password);
        const authToken = await User.generateAuthTokenAndSaveUser(user);
        res.status(201).send({ user, authToken });
        console.log("Création de la personne effectuée avec succès !");
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        const authToken = await User.generateAuthTokenAndSaveUser(user);
        res.send({ user, authToken });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/users/logout", authentification, async (req, res) => {
    try {
        await User.logout(req.user, req.authToken);
        res.send("Déconnexion effectuée avec succès !");
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/users/logout/all", authentification, async (req, res) => {
    try {
        await User.logoutAll(req.user);
        res.send("Déconnexion effectuée, de tous les appareils, avec succès !");
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/users/me", authentification, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch("/users/me", authentification, async (req, res) => {
    const updatedInfo = Object.keys(req.body);
    try {
        updatedInfo.forEach(update => req.user[update] = req.body[update]);
        await User.update(req.user);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete("/users/me", authentification, async (req, res) => {
    try {
        await User.delete(req.user);
        res.send(req.user);
        console.log("Suppression de la personne effectuée avec succès !");
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/users", authentification, async (req, res) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;

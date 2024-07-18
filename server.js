require("dotenv").config();
const { connectDB } = require("./src/services/mysql");
const userRoutes = require("./src/routes/user");

const express = require("express");
const app = express();
const port = process.env.PORT || 8383;

connectDB().catch(err => console.log(err));

app.use(express.json());
app.use(userRoutes);

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(port, () => {
    console.log(`Serveur démarré : http://localhost:${port}`);
});
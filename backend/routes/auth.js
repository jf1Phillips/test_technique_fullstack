require('dotenv').config();

const express = require('express');
const router = express.Router();

const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function is_null(str) {
    return (str === null ||
        str === "undefined" ||
        typeof str !== "string" ||
        str.trim().length === 0);
};

router.post("/register", async (req, res) => {
    const data = req.body;
    var email = data.email;
    var password = data.password;
    var username = data.username;

    if (is_null(email) || is_null(password) || is_null(username)) {
        return res.status(400).json({error: "Bad parameter"});
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: "Invalid email"});
    }
    if (password.length < 6) {
        return res.status(400).json({error: "Password too short"});
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        const db_return = await pool.query(
            'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id, email',
            [email, hashed, username]
        );
        res.json({ user: db_return.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(400).json({error: "User already exist"});
    }
});

router.post("/login", async (req, res) => {
    const data = req.body;
    var email = data.email;
    var password = data.password;

    if (is_null(email) || is_null(password)) {
        return res.status(400).json({error: "Bad parameter"});
    }
    try {
        const db_result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]);
        const user = db_result.rows[0];
        if (!user)
            return res.status(400).json({ error: "Invalid Credentials" });
        const is_good_pass = await bcrypt.compare(password, user.password);

        if (!is_good_pass)
            return res.status(400).json({ error: "Invalid Credentials" });
        const payload = { id: user.id, email: user.email, username: user.username };
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

        return res.json({"token": token});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

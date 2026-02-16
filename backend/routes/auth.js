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

    if (is_null(email) || is_null(password)) {
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
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashed]
        );
        res.json({ user: db_return.rows[0] });
    } catch (err) {
        console.log(err);
        res.status(400).json({error: "User already exist"});
    }
});

router.post("/login", async (req, res) => {
    const data = req.body;
    var email = data.email;
    var password = data.password;
});

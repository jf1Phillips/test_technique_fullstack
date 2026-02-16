require('dotenv').config();

const express = require('express');
const router = express.Router();
const checkToken = require("../config/checkToken");

const pool = require("../config/db");
const upload = require("../config/storage");

router.post("/upload", checkToken, upload.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    try {
        const real_filename = req.file.originalname;
        const filepath = req.file.path;

        const user_id = req.user.id;
        const username = req.user.username;
        const db_result = await pool.query(
            'INSERT INTO documents (filename, filepath, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, filename, filepath',
            [real_filename, filepath, user_id]
        );

        res.status(200).json({
            message: "File uploaded successfully",
            file: db_result.rows[0],
            username: username
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", checkToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const db_result = await pool.query(
            "SELECT id, filename, filepath FROM documents WHERE user_id = $1",
            [user_id]
        );

        if (db_result.rows.length === 0)
            return res.status(404).json({ error: "No document found." });
        return res.status(200).json(db_result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch documents." });
    }
});

module.exports = router;

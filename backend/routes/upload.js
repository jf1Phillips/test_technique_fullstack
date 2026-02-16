require('dotenv').config();

const express = require('express');
const router = express.Router();
const checkToken = require("../config/checkToken");

const pool = require("../config/db");
const upload = require("../config/storage");

router.post("/upload", checkToken, upload.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    const filepath = req.file.path;
    const filename = req.file.filename;

    const user_id = req.user.id;
    const username = req.user.username;

    try {
        const db_result = await pool.query(
            'INSERT INTO documents (filename, filepath, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, filename, filepath',
            [filename, filepath, user_id]
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

module.exports = router;

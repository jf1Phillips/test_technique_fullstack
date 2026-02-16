const jwt = require('jsonwebtoken');
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET;

function checkToken(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
        return res.status(401).json({ error: "Access denied" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Token is not valid" });
    }
}

module.exports = checkToken;

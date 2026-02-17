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
        if (err.name === "TokenExpiredError")
            return res.status(401).json({ error: "Token expired" });
        return res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = checkToken;

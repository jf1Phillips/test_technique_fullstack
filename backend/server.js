const express = require('express');
const cors = require("cors");
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth');
const docRoutes = require("./routes/documents");

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use('/auth', authRoutes);
app.use('/documents', docRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

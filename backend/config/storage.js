const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const file_ext = path.extname(file.originalname);
        const id = uuidv4();
        cb(null, id + file_ext);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;

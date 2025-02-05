require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user; // Attach decoded user data to request
    next();
  });
}

module.exports = authenticateJWT;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Import the auth middleware
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }
    
    // Your upload logic here
    res.status(200).json({ message: "Video uploaded successfully", filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: "Server error while uploading video" });
  }
});

module.exports = router;

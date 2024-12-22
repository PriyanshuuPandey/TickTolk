const express = require("express");
const multer = require("multer");
const Video = require("../models/video");
const router = express.Router();

// Set up multer for video storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/videos"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const video = new Video({ url: `/uploads/videos/${req.file.filename}` });
    await video.save();
    res.status(201).json({ message: "Video uploaded successfully!", video });
  } catch (err) {
    res.status(500).json({ error: "Video upload failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

module.exports = router;

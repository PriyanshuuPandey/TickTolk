const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ text: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);

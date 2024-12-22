const mongoose = require('mongoose');

const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ text: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  tags: [{ type: String }], // Add tags for better recommendations
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);

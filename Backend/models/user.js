const mongoose = require('mongoose');

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
notifications: [
    {
      message: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ];
  
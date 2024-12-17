const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const Video = require('./models/Video');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Multer Configuration for Video Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Routes
app.get('/', (req, res) => res.send("Welcome to the TikTok API"));

// Upload Video
app.post('/api/videos/upload', upload.single('video'), async (req, res) => {
  const videoUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  const video = new Video({ videoUrl });
  await video.save();
  res.json(video);
});

// Get Videos
app.get('/api/videos', async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// Like Video
app.post('/api/videos/:id/like', async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send("Video not found");
  video.likes += 1;
  await video.save();
  res.json({ likes: video.likes });
});

// Add Comment
app.post('/api/videos/:id/comment', async (req, res) => {
  const { text } = req.body;
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send("Video not found");
  video.comments.push({ text });
  await video.save();
  res.json(video.comments);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// User Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Middleware to Protect Routes
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
// Like Video (Protected Route)
app.post('/api/videos/:id/like', auth, async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");
  
    video.likes += 1;
    await video.save();
    res.json({ likes: video.likes });
  });
  
  // Add Comment (Protected Route)
  app.post('/api/videos/:id/comment', auth, async (req, res) => {
    const { text } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");
  
    video.comments.push({ text, user: req.user });
    await video.save();
    res.json(video.comments);
  });
  
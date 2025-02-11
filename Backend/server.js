const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
require("dotenv").config();

// Add views field to Video schema if not already present
// Video Schema and Model
// const videoSchema = new mongoose.Schema({
//   videoUrl: String,
//   likes: { type: Number, default: 0 },
//   comments: [{ text: String, user: String }],
//   views: { type: Number, default: 0 },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });
// const Video = mongoose.model('Video', videoSchema); (Duplicate declaration removed)

dotenv.config();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Multer Configuration for Video Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });
// const upload = multer({ storage }); (Duplicate declaration removed)

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

// const auth = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, 'secretKey');
//     req.user = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };
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
  // const PORT = process.env.PORT || 5000; (Duplicate declaration removed)
  // Follow User
app.post('/api/users/:id/follow', auth, async (req, res) => {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);
  
    if (!userToFollow || !currentUser) return res.status(404).json({ message: "User not found" });
  
    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
    }
  
    res.json({ message: "Followed successfully" });
  });
  
  // Unfollow User
  app.post('/api/users/:id/unfollow', auth, async (req, res) => {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);
  
    if (!userToUnfollow || !currentUser) return res.status(404).json({ message: "User not found" });
  
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
  
    await currentUser.save();
    await userToUnfollow.save();
  
    res.json({ message: "Unfollowed successfully" });
  });
  
  // Get User Profile
  app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('followers following', 'username');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });
  app.get('/api/videos/recommendations', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user).populate('following');
      const followingIds = user.following.map((followedUser) => followedUser._id);
  
      // Fetch videos uploaded by followed users or matching tags
      const recommendedVideos = await Video.find({
        $or: [
          { user: { $in: followingIds } },
          { tags: { $in: req.query.tags?.split(',') || [] } }, // Optional query for tags
        ],
      }).sort({ createdAt: -1 });
  
      res.json(recommendedVideos);
    } catch (error) {
      res.status(500).send('Error fetching recommendations');
    }
  });
  const sendNotification = require('./utils/notification');

app.post('/api/users/:id/follow', auth, async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user);

  if (!userToFollow || !currentUser) return res.status(404).json({ message: "User not found" });

  if (!currentUser.following.includes(userToFollow._id)) {
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    // Send Notification
    await sendNotification(userToFollow._id, `${currentUser.username} started following you.`);
  }

  res.json({ message: "Followed successfully" });
});

app.get('/api/videos/:id', async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");
  
    video.views += 1;
    await video.save();
  
    res.json(video);
  });
  async function fetchVideoDetails(videoId) {
    const response = await fetch('http://147.79.70.215/api/videos')
    const video = await response.json();
  
    document.getElementById('video-details').innerHTML = `
      <h3>${video.title}</h3>
      <p>Views: ${video.views}</p>
      <p>Likes: ${video.likes}</p>
      <p>Comments: ${video.comments.length}</p>
    `;
  }
  
  fetchVideoDetails('video-id');
  const http = require('http');
  const { Server } = require('socket.io');
  
  
  new Server((http.createServer(app)), {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
}).on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    socket.on('like', (data) => {
      new Server((http.createServer(app)), {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      }).emit('updateLike', data); // Broadcast to all users
    });
  
    socket.on('comment', (data) => {
      new Server((http.createServer(app)), {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      }).emit('newComment', data);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
  
  // Replace this with `server.listen()` to include Socket.IO
  (http.createServer(app)).listen(5000, () => console.log('Server running on port 5000'));
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: 'Something went wrong!' });
});
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://81463965157414e3d76f5e671006838c@o4508778338713600.ingest.us.sentry.io/4508778342711296' });

app.use(Sentry.Handlers.errorHandler());
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(require('./path/to/your/serviceAccountKey.json')),
});

async function sendPushNotification(token, message) {
  try {
    const response = await admin.messaging().send({
      token,
      notification: {
        title: message.title,
        body: message.body,
      },
    });
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Example usage:
sendPushNotification('user-token-here', { title: 'New Comment', body: 'Someone commented on your video!' });
const redis = require('redis');

client.on('connect', function() {
  console.log('Connected to Redis');
});

// Example: Caching video metadata
async function getVideoData(videoId) {
  const cacheKey = `video:${videoId}`;
  return new Promise((resolve, reject) => {
    client.get(cacheKey, async (err, result) => {
      if (err) reject(err);
      if (result) {
        resolve(JSON.parse(result)); // Return cached data
      } else {
        const videoData = await fetchVideoDataFromDB(videoId);
        client.setex(cacheKey, 3600, JSON.stringify(videoData)); // Cache for 1 hour
        resolve(videoData);
      }
    });
  });
}
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });

const upload = multer({ 
  storage,
  limits: { fileSize: 10000000 }, // Limit to 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  // Process file (e.g., move to S3, update database)
  res.send('File uploaded successfully');
});
const express = require('express');
const Razorpay = require('razorpay');

app.use(express.json()); // Middleware to parse JSON request bodies

// Create a subscription
app.post('/create-subscription', async (req, res) => {
  try {
    const { plan_id, customer_email } = req.body;  // Razorpay requires a plan_id

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: 'your-razorpay-key-id',  // Replace with your Razorpay Key ID
      key_secret: 'your-razorpay-key-secret' // Replace with your Razorpay Key Secret
    });

    // Create a subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan_id, // Replace with your Razorpay Plan ID
      customer_notify: 1,
      total_count: 12, // Example: 12 billing cycles
    });

    res.json({ subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Subscription creation failed' });
  }
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());

let videos = []; // This should be your video data stored in the database
let comments = []; // Comment data

// Like a video
app.post('/like/:videoId', (req, res) => {
  const { videoId } = req.params;
  const video = videos.find(v => v.id === videoId);
  if (video) {
    video.likes += 1;
    res.json({ message: 'Video liked!', video });
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
});

// Comment on a video
app.post('/comment/:videoId', (req, res) => {
  const { videoId } = req.params;
  const { userId, commentText } = req.body;
  const video = videos.find(v => v.id === videoId);
  if (video) {
    const newComment = {
      userId,
      videoId,
      text: commentText,
      createdAt: new Date(),
    };
    comments.push(newComment);
    res.json({ message: 'Comment added', comment: newComment });
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
});
const socketIo = require('socket.io');
const http = require('http');

new Server((http.createServer(app)), {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
}).on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Send notifications to a user
  socket.emit('notification', { message: 'You have a new like on your video!' });
});

(http.createServer(app)).listen(3000, () => console.log('Server is running'));
const socket = new Server((http.createServer(app)), {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})('http://localhost:3000');
socket.on('notification', (data) => {
  alert(data.message);
});
let followers = {}; // This should be a database model

app.post('/follow/:userId', (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user.id; // Assuming current user is authenticated

  if (!followers[currentUser]) followers[currentUser] = [];
  followers[currentUser].push(userId);

  res.json({ message: 'You are now following this user' });
});

app.post('/unfollow/:userId', (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user.id;

  if (followers[currentUser]) {
    followers[currentUser] = followers[currentUser].filter(id => id !== userId);
    res.json({ message: 'You unfollowed this user' });
  } else {
    res.status(404).json({ message: 'You are not following this user' });
  }
});
const tf = require('@tensorflow/tfjs');

const model = tf.sequential();
model.add(tf.layers.dense({ units: 128, inputShape: [5] }));
model.add(tf.layers.dense({ units: 64 }));
model.add(tf.layers.dense({ units: 1 }));

model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

// Use user data (like history, preferences) to train
const inputs = tf.tensor2d([[1, 0, 1, 0, 0]]);
const labels = tf.tensor2d([[1]]);
model.fit(inputs, labels, { epochs: 50 }).then(() => {
  model.predict(tf.tensor2d([[1, 1, 0, 1, 1]]))
    .print(); // Predicted video recommendations
});
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function moderateImage(imagePath) {
  const [result] = await client.safeSearchDetection(imagePath);
  const detections = result.safeSearchAnnotation;
  if (detections.adult >= 3) {
    return { moderate: true, message: 'Inappropriate content detected' };
  }
  return { moderate: false };
}
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
// const io = new Server(server, { 
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (message) => {
    new Server((http.createServer(app)), {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    }).emit("receiveMessage", message); // Broadcast message to all connected users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

(http.createServer(app)).listen(3000, () => console.log("Server running on port 3000"));
require("dotenv").config();
const express = require("express");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("TickTolk Server is Running!");
});

// Server listening on port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const http = require("http");
const startSocket = require("./socket");

startSocket(http.createServer(app));

http.createServer(app).listen(PORT, () => console.log(`Server running on port ${PORT}`));
const { limiter, helmet } = require("./security");

app.use(helmet());
app.use(limiter);
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

server.listen(PORT, () => console.log(`WebRTC Signaling Server running on port ${PORT}`));
    cors: {
        origin: "*"
    }

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });

    socket.on("signal", (data) => {
        socket.to(data.to).emit("signal", { from: socket.id, signal: data.signal });
    });
});+

// const PORT = process.env.PORT || 5000; (Duplicate declaration removed)
io.on("connection", (socket) => {
    viewers++;
    io.emit("update-viewers", viewers); // Send updated count

    socket.on("disconnect", () => {
        viewers--;
        io.emit("update-viewers", viewers); // Update count
    });
});
// Handle incoming chat messages
io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  // Broadcast chat messages to the room
  socket.on("chat-message", (message) => {
      socket.to("room1").emit("chat-message", message);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
  });
});
 
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
const admin = require('firebase-admin');
const redis = require('redis');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Middleware setup
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose.model('User', userSchema);

// Video Schema and Model
const videoSchema = new mongoose.Schema({
  videoUrl: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String, user: String }],
  views: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Video = mongoose.model('Video', videoSchema);

// Multer Configuration for Video Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
// const upload = multer({ storage }); (Duplicate declaration removed)

// User Authentication Middleware
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

// User Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  user = new User({ username, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
  res.json({ token });
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
  res.json({ token });
});

// Upload Video (Protected Route)
app.post('/api/videos/upload', auth, upload.single('video'), async (req, res) => {
  const videoUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  const video = new Video({ videoUrl, user: req.user });
  await video.save();
  res.json(video);
});

// Get All Videos
app.get('/api/videos', async (req, res) => {
  const videos = await Video.find().populate('user', 'username');
  res.json(videos);
});

// Like Video (Protected)
app.post('/api/videos/:id/like', auth, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send("Video not found");

  video.likes += 1;
  await video.save();
  res.json({ likes: video.likes });
});

// Add Comment (Protected)
app.post('/api/videos/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).send("Video not found");

  video.comments.push({ text, user: req.user });
  await video.save();
  res.json(video.comments);
});

// Follow User (Protected)
app.post('/api/users/:id/follow', auth, async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user);

  if (!userToFollow || !currentUser) return res.status(404).json({ message: "User not found" });

  if (!currentUser.following.includes(userToFollow._id)) {
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    await currentUser.save();
    await userToFollow.save();
  }

  res.json({ message: "Followed successfully" });
});

// WebSocket Setup for Real-time Notifications
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('like', (data) => {
    io.emit('updateLike', data);
  });

  socket.on('comment', (data) => {
    io.emit('newComment', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const express = require('express');
const Razorpay = require('razorpay');

app.use(express.json()); // Middleware to parse JSON request bodies

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'your-razorpay-key-id',  // Replace with your Razorpay Key ID
  key_secret: 'your-razorpay-key-secret' // Replace with your Razorpay Key Secret
});

// Create a subscription
app.post('/create-subscription', async (req, res) => {
  try {
    const { plan_id, customer_email } = req.body;  // Razorpay requires a plan_id

    // Create a subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan_id, // Replace with your Razorpay Plan ID
      customer_notify: 1,
      total_count: 12, // Example: 12 billing cycles
    });

    res.json({ subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Subscription creation failed' });
  }
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));


// Logger with Winston
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: 'Something went wrong!' });
});

// WebRTC Signaling
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("signal", (data) => {
    socket.to(data.to).emit("signal", { from: socket.id, signal: data.signal });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const MessageSchema = new mongoose.Schema({
  from: String,
  to: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", MessageSchema);

// Routes
app.post("/addContact", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Missing fields" });

  const existingUser = await User.findOne({ phone });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const newUser = new User({ name, phone });
  await newUser.save();
  res.json(newUser);
});

app.get("/contacts", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/messages/:from/:to", async (req, res) => {
  const { from, to } = req.params;
  const messages = await Message.find({
    $or: [{ from, to }, { from: to, to: from }]
  }).sort({ timestamp: 1 });
  res.json(messages);
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async ({ from, to, text }) => {
    const message = new Message({ from, to, text });
    await message.save();
    io.emit("receiveMessage", { from, to, text });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

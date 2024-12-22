const posts = [
    { image: "photo1.jpg", caption: "Beautiful sunset" },
    { image: "photo2.jpg", caption: "Adventure time!" },
  ];
  
  const postContainer = document.getElementById("post-container");
  
  // Render posts dynamically
  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post-item");
  
    const img = document.createElement("img");
    img.src = post.image;
    img.alt = post.caption;
  
    const caption = document.createElement("p");
    caption.textContent = `Caption: ${post.caption}`;
  
    postDiv.appendChild(img);
    postDiv.appendChild(caption);
    postContainer.appendChild(postDiv);
  });
  const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/posts"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const post = new Post({ 
      image: `/uploads/posts/${req.file.filename}`, 
      caption: req.body.caption 
    });
    await post.save();
    res.status(201).json({ message: "Post uploaded successfully!", post });
  } catch (err) {
    res.status(500).json({ error: "Post upload failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
async function fetchPosts() {
    const response = await fetch("/posts");
    const posts = await response.json();
    postContainer.innerHTML = "";
    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post-item");
  
      const img = document.createElement("img");
      img.src = post.image;
      img.alt = post.caption;
  
      const caption = document.createElement("p");
      caption.textContent = `Caption: ${post.caption}`;
  
      postDiv.appendChild(img);
      postDiv.appendChild(caption);
      postContainer.appendChild(postDiv);
    });
  }
  
  fetchPosts();
  
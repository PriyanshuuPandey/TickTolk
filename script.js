
// Function to play the current video and pause others
function playCurrentVideo() {
  videos.forEach((video, index) => {
    if (index === currentIndex) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0; // Reset video time
    }
  });
}

// Event Listener for Swipe (Scroll)
document.getElementById('video-container').addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    // Scroll down
    if (currentIndex < videos.length - 1) currentIndex++;
  } else {
    // Scroll up
    if (currentIndex > 0) currentIndex--;
  }
  scrollToVideo();
});

// Scroll to the active video
function scrollToVideo() {
  videos[currentIndex].scrollIntoView({ behavior: 'smooth' });
  playCurrentVideo();
}

// Play/Pause Toggle on Click
videos.forEach((video) => {
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});

// Initialize the first video
playCurrentVideo();
const videos = document.querySelectorAll('.video');
const likeButton = document.querySelector('.like-button');
const likeCount = document.getElementById('like-count');
const muteButton = document.querySelector('.mute-button');
let currentIndex = 0;
let likes = 1200000; // Starting like count (1.2M)

// Function to play the current video
function playCurrentVideo() {
  videos.forEach((video, index) => {
    if (index === currentIndex) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}

// Scroll Event (Swipe Effect)
document.getElementById('video-container').addEventListener('wheel', (event) => {
  if (event.deltaY > 0 && currentIndex < videos.length - 1) {
    currentIndex++;
  } else if (event.deltaY < 0 && currentIndex > 0) {
    currentIndex--;
  }
  scrollToVideo();
});

// Scroll to Active Video
function scrollToVideo() {
  videos[currentIndex].scrollIntoView({ behavior: 'smooth' });
  playCurrentVideo();
}

// Like Button Animation and Counter Update
likeButton.addEventListener('click', () => {
  likeButton.classList.toggle('liked');
  if (likeButton.classList.contains('liked')) {
    likes++;
  } else {
    likes--;
  }
  likeCount.textContent = formatLikes(likes);
});

// Format Likes (e.g., 1.2M)
function formatLikes(num) {
  return num >= 1000000 ? (num / 1000000).toFixed(1) + "M" : num.toLocaleString();
}

// Mute/Unmute Toggle
muteButton.addEventListener('click', () => {
  const video = videos[currentIndex];
  video.muted = !video.muted;
  muteButton.textContent = video.muted ? "🔇" : "🔊";
});

// Touch Swipe Support for Mobile
let touchStartY = 0;

document.getElementById('video-container').addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

document.getElementById('video-container').addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  if (touchStartY - touchEndY > 50 && currentIndex < videos.length - 1) {
    currentIndex++; // Swipe Up
  } else if (touchEndY - touchStartY > 50 && currentIndex > 0) {
    currentIndex--; // Swipe Down
  }
  scrollToVideo();
});

// Initialize First Video
playCurrentVideo();
async function fetchVideos() {
  const response = await fetch('http://localhost:5000/api/videos');
  const videos = await response.json();

  const videoContainer = document.getElementById('video-container');
  videoContainer.innerHTML = ''; // Clear existing videos

  videos.forEach((video) => {
    const videoElement = document.createElement('video');
    videoElement.src = video.videoUrl;
    videoElement.classList.add('video');
    videoElement.autoplay = false;
    videoElement.loop = true;

    videoContainer.appendChild(videoElement);
  });

  playCurrentVideo();
}

// Fetch videos on page load
window.onload = fetchVideos;
async function likeVideo(videoId) {
  const response = await fetch(`http://localhost:5000/api/videos/${videoId}/like`, {
    method: 'POST',
  });
  const data = await response.json();
  alert(`Likes: ${data.likes}`);
}
async function addComment(videoId) {
  const text = document.getElementById('comment-input').value;
  const response = await fetch(`http://localhost:5000/api/videos/${videoId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const comments = await response.json();
  console.log("Comments:", comments);
}
async function followUser(userId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://147.79.70.215/api/users/${userId}/follow`, {
    method: 'POST',
    headers: { 'Authorization': token },
  });
  const data = await response.json();
  alert(data.message);
}

async function unfollowUser(userId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://147.79.70.215/api/users/${userId}/unfollow`, {
    method: 'POST',
    headers: { 'Authorization': token },
  });
  const data = await response.json();
  alert(data.message);
}

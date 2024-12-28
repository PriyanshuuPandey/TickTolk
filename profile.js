window.onload = function() {
  // Load profile data from localStorage
  const avatar = localStorage.getItem("avatar") || "https://via.placeholder.com/150";
  const username = localStorage.getItem("username") || "No username set";
  const bio = localStorage.getItem("bio") || "No bio set";
  const followers = localStorage.getItem("followers") || 0;
  const following = localStorage.getItem("following") || 0;
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];

  // Update profile header
  document.getElementById("profile-avatar").src = avatar;
  document.getElementById("profile-username").textContent = username;
  document.getElementById("profile-bio").textContent = bio;
  document.getElementById("profile-followers").textContent = `${followers} followers`;
  document.getElementById("profile-following").textContent = `${following} following`;

  // Show user's posts initially
  loadVideos(posts);

  // Toggle between posts and liked videos
  document.getElementById("postsTab").addEventListener("click", function() {
    this.classList.add("active");
    document.getElementById("likedTab").classList.remove("active");
    loadVideos(posts);
  });

  document.getElementById("likedTab").addEventListener("click", function() {
    this.classList.add("active");
    document.getElementById("postsTab").classList.remove("active");
    loadVideos(likedPosts);
  });
};

function loadVideos(videos) {
  const videoContainer = document.getElementById("profileVideos");
  videoContainer.innerHTML = ""; // Clear existing videos

  if (videos.length === 0) {
    videoContainer.innerHTML = "<p>No videos to display.</p>";
    return;
  }

  videos.forEach(function(videoUrl) {
    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;
    videoElement.controls = true;
    videoElement.classList.add("video-item");
    videoContainer.appendChild(videoElement);
  });
}

function editProfile() {
  window.location.href = "editprofile.html"; // Navigate to edit profile page
}
    // Load user data from localStorage
    const username = localStorage.getItem("username") || "Guest";
    const bio = localStorage.getItem("bio") || "No bio available. Edit your profile!";

    document.getElementById("usernameDisplay").innerText = username;
    document.getElementById("bioDisplay").innerText = bio;

    // If no user is logged in, redirect to login page
    if (!localStorage.getItem("username")) {
      alert("Please log in first!");
      window.location.href = "login.html";}
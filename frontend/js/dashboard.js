router.get("/analytics", async (req, res) => {
    const videoCount = await Video.countDocuments();
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
  
    res.json({ videoCount, userCount, postCount });
  });
  async function fetchAnalytics() {
    const response = await fetch("/api/analytics");
    const { videoCount, userCount, postCount } = await response.json();
  
    document.getElementById("video-count").textContent = `Videos: ${videoCount}`;
    document.getElementById("user-count").textContent = `Users: ${userCount}`;
    document.getElementById("post-count").textContent = `Posts: ${postCount}`;
  }
  
  fetchAnalytics();
    
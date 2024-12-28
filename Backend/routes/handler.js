app.get("/api/search", (req, res) => {
  const { q, page } = req.query;
  const pageSize = 20; // Number of videos per page
  const allVideos = videoData.filter(video =>
    video.title.toLowerCase().includes(q.toLowerCase())
  );
  const paginatedVideos = allVideos.slice((page - 1) * pageSize, page * pageSize);
  res.json({ results: paginatedVideos });
});

  fetchRecommendations(['funny', 'dance']);
  async function fetchRecommendations(tags = []) {
    const token = localStorage.getItem('token');
    const query = tags.length ? `?tags=${tags.join(',')}` : '';
  
    const response = await fetch(`https://your-app.herokuapp.com/api/videos/recommendations${query}`, {
      headers: { Authorization: token },
    });
    const videos = await response.json();
  
    displayVideos(videos);
  }
  
  fetchRecommendations(['funny', 'dance']); 
  
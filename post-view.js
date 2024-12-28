async function loadPosts() {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const posts = await response.json();
  
      const postContainer = document.getElementById('post-container');
      postContainer.innerHTML = posts
        .map(
          (post) => `
          <div class="post-item">
            <img src="${post.photo}" alt="${post.title}">
            <p>Caption: ${post.caption}</p>
          </div>
        `
        )
        .join('');
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }
  
  loadPosts();
  
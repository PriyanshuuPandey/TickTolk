document.querySelector('.post-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('post-title').value;
  const caption = document.getElementById('post-caption').value;
  const file = document.getElementById('post-photo').files[0];

  const formData = new FormData();
  formData.append('title', title);
  formData.append('caption', caption);
  formData.append('photo', file);

  try {
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Post created successfully!');
    } else {
      alert('Error creating post.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to connect to the server.');
  }
});

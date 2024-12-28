function likeVideo(videoId) {
    fetch(`http://localhost:5000/api/videos/${videoId}/like`, { method: 'POST' })
      .then(() => {
        console.log(`Liked video ${videoId}`);
      })
      .catch((error) => console.error('Failed to like video:', error));
  }
  
  function commentVideo(videoId, commentText) {
    fetch(`http://localhost:5000/api/videos/${videoId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText }),
    })
      .then(() => {
        console.log(`Commented on video ${videoId}`);
      })
      .catch((error) => console.error('Failed to comment on video:', error));
  }
  socket.on('updateLike', (data) => {
    const likeCountElement = document.getElementById(`like-count-${data.videoId}`);
    if (likeCountElement) {
      likeCountElement.innerText = data.likes;
    }
  });
  
  socket.on('newComment', (data) => {
    const commentListElement = document.getElementById(`comments-${data.videoId}`);
    if (commentListElement) {
      commentListElement.innerHTML += `<div>${data.comment}</div>`;
    }
  });
const socket = io('http://localhost:5000');
// Listen for updates
socket.on('updateLike', (data) => {
  console.log('New like:', data);
  // Update the UI dynamically
});
socket.on('newComment', (data) => {
  console.log('New comment:', data);
  // Add comment to the comment list dynamically
});
// Emit events when actions happen
function likeVideo(videoId) {
  fetch(`/api/videos/${videoId}/like`, { method: 'POST' }) // Backend like API
    .then(() => socket.emit('like', { videoId }));
}
function commentVideo(videoId, commentText) {
  fetch(`/api/videos/${videoId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ text: commentText }),
    headers: { 'Content-Type': 'application/json' },
  }).then(() => socket.emit('comment', { videoId, comment: commentText }));
}
// Like Logic
const likeIcon = document.getElementById("like-icon");
const likeCount = document.getElementById("like-count");
let hasLiked = false;

likeIcon.addEventListener("click", () => {
    if (!hasLiked) {
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        hasLiked = true;
    } else {
        alert("You have already liked this video!");
    }
});
const commentIcon = document.getElementById("comment-icon");
const commentModal = document.getElementById("comment-modal");
const closeCommentModalBtn = document.getElementById("close-comment-modal");
const commentsList = document.getElementById("comments-list");
const commentInput = document.getElementById("comment-input");
const postCommentBtn = document.getElementById("post-comment");
const loadMoreCommentsBtn = document.getElementById("load-more-comments");
const commentCount = document.getElementById("comment-count");

let comments = []; // Mocked data source
let currentPage = 0;
const pageSize = 5;

const fetchComments = (page) => {
// Simulated API call with pagination
return comments.slice(page * pageSize, (page + 1) * pageSize);
};

const renderComments = (newComments) => {
newComments.forEach((comment, index) => {
const commentItem = document.createElement("div");
commentItem.className = "comment-item";
commentItem.innerHTML = `
    <div class="details">
        <strong>${comment.user}</strong>
        <span>${comment.text}</span>
    </div>
    <div class="actions">
        <button onclick="likeComment(${index})">❤️ ${comment.likes}</button>
        <button onclick="replyToComment(${index})">Reply</button>
    </div>
`;
commentsList.appendChild(commentItem);
});
};

const loadMoreComments = () => {
const newComments = fetchComments(currentPage);
renderComments(newComments);
currentPage++;
if (currentPage * pageSize >= comments.length) {
loadMoreCommentsBtn.style.display = "none";
}
};

const postComment = () => {
const text = commentInput.value.trim();
if (text) {
comments.push({ user: "You", text, likes: 0 });
commentCount.textContent = comments.length;
commentInput.value = "";
commentsList.innerHTML = ""; // Reset list for rerendering
currentPage = 0;
loadMoreComments();
}
};

const likeComment = (index) => {
comments[index].likes++;
commentsList.innerHTML = ""; // Reset list for rerendering
currentPage = 0;
loadMoreComments();
};

commentIcon.addEventListener("click", () => {
commentModal.style.display = "block";
commentsList.innerHTML = ""; // Reset list for rerendering
currentPage = 0;
loadMoreComments();
});

closeCommentModalBtn.addEventListener("click", () => {
commentModal.style.display = "none";
});

postCommentBtn.addEventListener("click", postComment);
loadMoreCommentsBtn.addEventListener("click", loadMoreComments);

// Initializing comments (mock)
comments = [
{ user: "User1", text: "Great video!", likes: 10 },
{ user: "User2", text: "Loved this!", likes: 5 },
// More mock comments...
];
// Share Modal Logic
const shareIcon = document.getElementById("share-icon");
const shareModal = document.getElementById("share-modal");
const closeShareModalBtn = document.getElementById("close-share-modal");

shareIcon.addEventListener("click", () => {
    shareModal.style.display = "block";
});

closeShareModalBtn.addEventListener("click", () => {
    shareModal.style.display = "none";
});

const copyToClipboard = () => {
    const shareLink = document.getElementById("share-link");
    shareLink.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
};

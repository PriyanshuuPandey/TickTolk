// creatorprofile.js

document.addEventListener("DOMContentLoaded", () => {
  const followButton = document.querySelector(".follow-button");

  // Toggle follow state
  followButton.addEventListener("click", () => {
      if (followButton.textContent === "Follow") {
          followButton.textContent = "Following";
          followButton.style.backgroundColor = "#00c853"; // Change color to indicate following
      } else {
          followButton.textContent = "Follow";
          followButton.style.backgroundColor = "#ff3b5c"; // Change back to default color
      }
  });

  // Dynamically load videos
  const videoGallery = document.querySelector(".video-gallery");
  const videoSources = [
      "video1.mp4",
      "video2.mp4",
      "video3.mp4",
      "video4.mp4",
      "video5.mp4",
      "video6.mp4",
  ];

  // Clear existing videos
  videoGallery.innerHTML = "";

  // Add videos dynamically
  videoSources.forEach((videoSrc) => {
      const videoItem = document.createElement("div");
      videoItem.classList.add("video-item");

      const videoElement = document.createElement("video");
      videoElement.controls = true;

      const sourceElement = document.createElement("source");
      sourceElement.src = videoSrc;
      sourceElement.type = "video/mp4";

      videoElement.appendChild(sourceElement);
      videoItem.appendChild(videoElement);
      videoGallery.appendChild(videoItem);
  });
});
// creatorprofile.js

document.addEventListener("DOMContentLoaded", () => {
    const followButton = document.querySelector(".follow-button");
    const followersCountElement = document.querySelector(".profile-stats div:nth-child(1) h2");
    const followingCountElement = document.querySelector(".profile-stats div:nth-child(2) h2");
    const likesCountElement = document.querySelector(".profile-stats div:nth-child(3) h2");

    let followersCount = parseInt(followersCountElement.textContent.replace(/[^\d]/g, ""));
    let followingCount = parseInt(followingCountElement.textContent.replace(/[^\d]/g, ""));
    let likesCount = parseInt(likesCountElement.textContent.replace(/[^\d]/g, ""));

    // Follow button functionality
    followButton.addEventListener("click", () => {
        if (followButton.textContent === "Follow") {
            followButton.textContent = "Following";
            followButton.style.backgroundColor = "#00c853"; // Change to 'Following' color
            followersCount++;
            followersCountElement.textContent = formatNumber(followersCount);
        } else {
            followButton.textContent = "Follow";
            followButton.style.backgroundColor = "#ff3b5c"; // Revert to 'Follow' color
            followersCount--;
            followersCountElement.textContent = formatNumber(followersCount);
        }
    });

    // Simulate like functionality for each video
    const videoGallery = document.querySelector(".video-gallery");
    videoGallery.addEventListener("click", (event) => {
        if (event.target.tagName === "VIDEO") {
            likesCount++;
            likesCountElement.textContent = formatNumber(likesCount);
        }
    });

    // Helper function to format numbers
    function formatNumber(num) {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num.toString();
    }
});
// creatorprofile.js

document.addEventListener("DOMContentLoaded", () => {
    const followButton = document.querySelector(".follow-button");
    const followersCountElement = document.querySelector(".profile-stats div:nth-child(1) h2");
    const followingCountElement = document.querySelector(".profile-stats div:nth-child(2) h2");
    const likesCountElement = document.querySelector(".profile-stats div:nth-child(3) h2");

    let followersCount = parseInt(followersCountElement.textContent.replace(/[^\d]/g, ""));
    let followingCount = parseInt(followingCountElement.textContent.replace(/[^\d]/g, ""));
    let likesCount = parseInt(likesCountElement.textContent.replace(/[^\d]/g, ""));

    let isActionInProgress = false; // Flag to track action status

    // Follow button functionality
    followButton.addEventListener("click", () => {
        if (isActionInProgress) return; // Prevent new action until the current one finishes
        isActionInProgress = true;

        if (followButton.textContent === "Follow") {
            followButton.textContent = "Following";
            followButton.style.backgroundColor = "#00c853"; // Change to 'Following' color
            followersCount++;
        } else {
            followButton.textContent = "Follow";
            followButton.style.backgroundColor = "#ff3b5c"; // Revert to 'Follow' color
            followersCount--;
        }

        followersCountElement.textContent = formatNumber(followersCount);
        setTimeout(() => {
            isActionInProgress = false; // Allow the next action after 500ms
        }, 500);
    });

    // Simulate like functionality for each video
    const videoGallery = document.querySelector(".video-gallery");
    videoGallery.addEventListener("click", (event) => {
        if (isActionInProgress) return; // Prevent new action until the current one finishes
        if (event.target.tagName === "VIDEO") {
            isActionInProgress = true;

            likesCount++;
            likesCountElement.textContent = formatNumber(likesCount);

            setTimeout(() => {
                isActionInProgress = false; // Allow the next action after 500ms
            }, 500);
        }
    });

    // Helper function to format numbers
    function formatNumber(num) {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num.toString();
    }
});

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const loader = document.getElementById("loader");

let currentPage = 1;
let query = "";

// Fetch search results
async function fetchResults(page = 1) {
  loader.style.display = "block";
  const response = await fetch(`/api/search?q=${query}&page=${page}`);
  const { results } = await response.json();
  loader.style.display = "none";
  return results;
}

// Render results in a grid
function renderResults(results) {
  results.forEach(video => {
    const videoItem = document.createElement("div");
    videoItem.className = "result-item";
    videoItem.innerHTML = `
      <video src="${video.url}" muted></video>
      <div class="video-overlay">
        <button class="like">❤️</button>
        <button class="share">🔗</button>
        <button class="comment">💬</button>
      </div>
    `;
    videoItem.querySelector("video").addEventListener("click", () => {
      videoItem.querySelector("video").play();
    });
    searchResults.appendChild(videoItem);
  });
}

// Load more results on scroll
window.addEventListener("scroll", async () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    currentPage++;
    const results = await fetchResults(currentPage);
    renderResults(results);
  }
});

// Trigger search on button click
searchButton.addEventListener("click", async () => {
  query = searchInput.value.trim();
  currentPage = 1;
  searchResults.innerHTML = ""; // Clear previous results
  const results = await fetchResults(currentPage);
  renderResults(results);
});
async function fetchTrending() {
  const response = await fetch("/api/trending");
  const trendingItems = await response.json();

  const trendingContainer = document.getElementById("trendingContainer");
  trendingItems.forEach(item => {
    const trendingItem = document.createElement("div");
    trendingItem.className = "trending-item";
    trendingItem.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" />
      <p>${item.title}</p>
    `;
    trendingItem.addEventListener("click", () => {
      searchInput.value = `#${item.hashtag}`;
      searchButton.click();
    });
    trendingContainer.appendChild(trendingItem);
  });
}

fetchTrending();
const categoryFilter = document.getElementById("categoryFilter");
const durationFilter = document.getElementById("durationFilter");
const timeFilter = document.getElementById("timeFilter");

async function fetchFilteredResults() {
  const category = categoryFilter.value;
  const duration = durationFilter.value;
  const time = timeFilter.value;

  const response = await fetch(
    `/api/search?q=${query}&category=${category}&duration=${duration}&time=${time}&page=${currentPage}`
  );
  const { results } = await response.json();
  return results;
}

// Re-fetch results when filters are changed
[categoryFilter, durationFilter, timeFilter].forEach(filter => {
  filter.addEventListener("change", async () => {
    searchResults.innerHTML = "";
    currentPage = 1;
    const results = await fetchFilteredResults();
    renderResults(results);
  });
});
document.querySelectorAll(".result-item video").forEach(video => {
  video.addEventListener("mouseover", () => video.play());
  video.addEventListener("mouseout", () => video.pause());
});
async function fetchPopularUsers() {
  const response = await fetch("/api/popular-users");
  const users = await response.json();

  const usersContainer = document.getElementById("usersContainer");
  users.forEach(user => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.innerHTML = `
      <img src="${user.avatar}" alt="${user.name}" />
      <p>${user.name}</p>
    `;
    userCard.addEventListener("click", () => {
      searchInput.value = `@${user.username}`;
      searchButton.click();
    });
    usersContainer.appendChild(userCard);
  });
}

fetchPopularUsers();
const suggestionBox = document.createElement("div");
suggestionBox.id = "suggestionBox";
document.body.appendChild(suggestionBox);

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (!query) {
    suggestionBox.style.display = "none";
    return;
  }

  const response = await fetch(`/api/suggestions?q=${query}`);
  const suggestions = await response.json();

  suggestionBox.style.display = "block";
  suggestionBox.innerHTML = suggestions
    .map(suggestion => `<p>${suggestion}</p>`)
    .join("");

  document.querySelectorAll("#suggestionBox p").forEach(item => {
    item.addEventListener("click", () => {
      searchInput.value = item.textContent;
      searchButton.click();
    });
  });
});

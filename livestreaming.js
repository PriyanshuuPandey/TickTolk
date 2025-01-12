// Viewer count simulation
const viewerCounts = [0, 0, 0];
setInterval(() => {
    viewerCounts.forEach((count, index) => {
        viewerCounts[index] += Math.floor(Math.random() * 10); // Random increment
        document.getElementById(`viewerCount${index + 1}`).innerText = `${viewerCounts[index]} viewers`;
    });
}, 3000); // Update every 3 seconds

// Search functionality
const cards = document.querySelectorAll('.grid > div');
searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// Floating action button event
const fab = document.getElementById('floatingActionButton');
fab.addEventListener('click', () => {
    alert('Go Live feature coming soon!');
});
// Sample live stream data
const liveStreams = [
    { id: 1, title: "Gamer123 playing Fortnite", category: "Gaming", thumbnail: "https://placehold.co/300x200", viewers: 102 },
    { id: 2, title: "Live Concert by John Doe", category: "Music", thumbnail: "https://placehold.co/300x200", viewers: 58 },
    { id: 3, title: "Cooking Show with Chef Alex", category: "Cooking", thumbnail: "https://placehold.co/300x200", viewers: 74 },
];

// Function to render live streams
function renderLiveStreams() {
    const grid = document.getElementById("liveStreamsGrid");
    grid.innerHTML = ""; // Clear previous streams

    liveStreams.forEach((stream) => {
        const streamCard = `
            <div class="bg-white p-4 rounded shadow hover:shadow-lg transition group relative overflow-hidden">
                <img 
                    alt="${stream.title}" 
                    class="w-full h-40 object-cover rounded mb-2 transform group-hover:scale-105 transition" 
                    src="${stream.thumbnail}"
                />
                <h3 class="text-lg font-bold">${stream.title}</h3>
                <p class="text-sm text-gray-600 mb-4" id="viewerCount${stream.id}">
                    ${stream.viewers} viewers
                </p>
                <button class="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm rounded shadow hover:bg-blue-700 transition">
                    Watch Now
                </button>
            </div>
        `;
        grid.innerHTML += streamCard;
    });
}

// Function to update viewer counts
function updateViewerCounts() {
    liveStreams.forEach((stream) => {
        stream.viewers += Math.floor(Math.random() * 10); // Increment viewers randomly
        const viewerElement = document.getElementById(`viewerCount${stream.id}`);
        if (viewerElement) {
            viewerElement.textContent = `${stream.viewers} viewers`;
        }
    });
}

// Search functionality
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    liveStreams.forEach((stream) => {
        const card = document.querySelector(`[alt="${stream.title}"]`).parentNode;
        if (stream.title.toLowerCase().includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

// Add new live stream
const floatingButton = document.getElementById("floatingActionButton");
floatingButton.addEventListener("click", () => {
    const newStream = {
        id: liveStreams.length + 1,
        title: `New Live Stream ${liveStreams.length + 1}`,
        thumbnail: "https://placehold.co/300x200",
        viewers: 0,
    };
    liveStreams.push(newStream);
    renderLiveStreams();
});

// Initial render
renderLiveStreams();

// Update viewer counts every 5 seconds
setInterval(updateViewerCounts, 5000);
// Live stream data

// Function to render live streams
function renderLiveStreams() {
    const grid = document.getElementById("liveStreamsGrid");
    grid.innerHTML = "";
    liveStreams.forEach((stream) => {
        grid.innerHTML += `
            <div class="bg-white p-4 rounded shadow hover:shadow-lg transition group relative overflow-hidden">
                <img 
                    alt="${stream.title}" 
                    class="w-full h-40 object-cover rounded mb-2 transform group-hover:scale-105 transition" 
                    src="${stream.thumbnail}"
                />
                <h3 class="text-lg font-bold">${stream.title}</h3>
                <p class="text-sm text-gray-600 mb-4" id="viewerCount${stream.id}">
                    ${stream.viewers} viewers
                </p>
                <button class="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm rounded shadow hover:bg-blue-700 transition">
                    Watch Now
                </button>
            </div>
        `;
    });
}

// Add new live stream
function addLiveStream(title, category, thumbnail) {
    const newStream = {
        id: liveStreams.length + 1,
        title: `${title} (${category})`,
        thumbnail,
        viewers: 0,
    };
    liveStreams.push(newStream);
    renderLiveStreams();
}

// Event listeners for Go Live feature
document.getElementById("goLive").addEventListener("click", () => {
    document.getElementById("goLiveModal").classList.remove("hidden");
});

document.getElementById("cancelGoLive").addEventListener("click", () => {
    document.getElementById("goLiveModal").classList.add("hidden");
});

document.getElementById("goLiveForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("streamTitle").value.trim();
    const category = document.getElementById("streamCategory").value.trim();
    const thumbnail = document.getElementById("streamThumbnail").value.trim();

    if (title && category && thumbnail) {
        addLiveStream(title, category, thumbnail);
        document.getElementById("goLiveModal").classList.add("hidden");
        document.getElementById("goLiveForm").reset();
    } else {
        alert("Please fill in all fields.");
    }
});

// Initial render
renderLiveStreams();
// Sample data for initial live streams
// Sample data for initial live streams
function renderLiveStreams(filter = "") {
    const grid = document.getElementById("liveStreamsGrid");
    grid.innerHTML = ""; // Clear the grid

    // Filter streams based on search input
    const filteredStreams = liveStreams.filter(stream =>
        stream.title.toLowerCase().includes(filter.toLowerCase())
    );

    // Generate stream cards
    filteredStreams.forEach(stream => {
        const card = `
            <div class="bg-white p-4 rounded shadow hover:shadow-lg transition group relative overflow-hidden">
                <img 
                    alt="${stream.title}" 
                    class="w-full h-40 object-cover rounded mb-2 transform group-hover:scale-105 transition" 
                    src="${stream.thumbnail}" 
                />
                <h3 class="text-lg font-bold">${stream.title}</h3>
                <p class="text-sm text-gray-600 mb-4">Category: ${stream.category}</p>
                <p class="text-sm text-gray-600 mb-4">${stream.viewers} viewers</p>
                <button class="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm rounded shadow hover:bg-blue-700 transition">
                    Watch Now
                </button>
            </div>
        `;
        grid.innerHTML += card;
    });

    // If no streams match the search, show a message
    if (filteredStreams.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 text-center">No live streams found.</p>`;
    }
}

// Function to add a new live stream
function addLiveStream(title, category, thumbnail) {
    const newStream = {
        id: liveStreams.length + 1,
        title,
        category,
        thumbnail,
        viewers: Math.floor(Math.random() * 100), // Generate random viewers count
    };
    liveStreams.push(newStream);
    renderLiveStreams(); // Refresh the grid
}

// Event listeners for "Go Live" modal
document.getElementById("goLive").addEventListener("click", () => {
    document.getElementById("goLiveModal").classList.remove("hidden");
});

document.getElementById("cancelGoLive").addEventListener("click", () => {
    document.getElementById("goLiveModal").classList.add("hidden");
});

document.getElementById("goLiveForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Get input values
    const title = document.getElementById("streamTitle").value.trim();
    const category = document.getElementById("streamCategory").value.trim();
    const thumbnail = document.getElementById("streamThumbnail").value.trim();

    // Validate inputs
    if (title && category && thumbnail) {
        addLiveStream(title, category, thumbnail);
        document.getElementById("goLiveModal").classList.add("hidden");
        document.getElementById("goLiveForm").reset();
    } else {
        alert("Please fill in all fields.");
    }
});

// Event listener for search bar
document.getElementById("searchBar").addEventListener("input", (e) => {
    const searchQuery = e.target.value.trim();
    renderLiveStreams(searchQuery);
});

// Initial rendering of live streams
renderLiveStreams();

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
    { id: 1, title: "Gamer123 playing Fortnite", thumbnail: "https://placehold.co/300x200", viewers: 0 },
    { id: 2, title: "Live Concert by John Doe", thumbnail: "https://placehold.co/300x200", viewers: 0 },
    { id: 3, title: "Cooking Show with Chef Alex", thumbnail: "https://placehold.co/300x200", viewers: 0 },
    { id: 4, title: "Math Lecture by Prof. Smith", thumbnail: "https://placehold.co/300x200", viewers: 0 },
    { id: 5, title: "Stand-up Comedy Show", thumbnail: "https://placehold.co/300x200", viewers: 0 },
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

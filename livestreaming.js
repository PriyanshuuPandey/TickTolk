// Viewer count simulation
const viewerCounts = [0, 0, 0];
setInterval(() => {
    viewerCounts.forEach((count, index) => {
        viewerCounts[index] += Math.floor(Math.random() * 10); // Random increment
        document.getElementById(`viewerCount${index + 1}`).innerText = `${viewerCounts[index]} viewers`;
    });
}, 3000); // Update every 3 seconds

// Search functionality
const searchBar = document.getElementById('searchBar');
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

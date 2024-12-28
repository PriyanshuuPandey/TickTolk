async function fetchNotifications() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/notifications', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const notifications = await response.json();
  const notificationsDiv = document.getElementById('notifications');
  notificationsDiv.innerHTML = notifications
    .map((n) => `<div>${n.message} - ${new Date(n.createdAt).toLocaleString()}</div>`)
    .join('');
}

fetchNotifications();

const User = require('../models/User');

const sendNotification = async (userId, message) => {
  const user = await User.findById(userId);
  if (user) {
    user.notifications.push({ message });
    await user.save();
  }
};
module.exports = sendNotification;
const express = require("express");
const router = express.Router();

let notifications = [];

router.get("/", (req, res) => {
  res.json(notifications);
});

router.post("/", (req, res) => {
  const { userId, message } = req.body;
  notifications.push({ userId, message, time: new Date() });
  res.status(201).json({ success: true, notification: { userId, message } });
});

module.exports = router;
async function fetchNotifications() {
  const response = await fetch("/api/notifications");
  const notifications = await response.json();
  const notificationContainer = document.getElementById("notifications");

  notifications.forEach((notification) => {
    const notifDiv = document.createElement("div");
    notifDiv.classList.add("notification");
    notifDiv.textContent = `${notification.message} at ${new Date(notification.time).toLocaleTimeString()}`;
    notificationContainer.appendChild(notifDiv);
  });
}

fetchNotifications();

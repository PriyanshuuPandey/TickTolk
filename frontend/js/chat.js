const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.querySelector(".chat-messages");

sendBtn.addEventListener("click", () => {
  const messageText = chatInput.value.trim();
  if (messageText) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", "sent");
    newMessage.textContent = messageText;
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";
  }
});

const userChats = {
  "User 1": ["Hello!"],
  "User 2": ["Hi, how's it going?"],
};

const activeUser = { name: "User 1" };

// Render messages dynamically
function renderMessages() {
  chatMessages.innerHTML = "";
  userChats[activeUser.name].forEach((msg, index) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", index % 2 === 0 ? "received" : "sent");
    messageDiv.textContent = msg;
    chatMessages.appendChild(messageDiv);
  });
}

// Add a new message
sendBtn.addEventListener("click", () => {
  const newMessage = chatInput.value.trim();
  if (newMessage) {
    userChats[activeUser.name].push(newMessage);
    renderMessages();
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";
  }
});

// Initialize chat
renderMessages();
const socket = io("http://localhost:3000");

// Render new messages
socket.on("receiveMessage", (message) => {
  const newMessage = document.createElement("div");
  newMessage.classList.add("message", "received");
  newMessage.textContent = message;
  chatMessages.appendChild(newMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Send message to server
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (message) {
    socket.emit("sendMessage", message);
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", "sent");
    newMessage.textContent = message;
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";
  }
});

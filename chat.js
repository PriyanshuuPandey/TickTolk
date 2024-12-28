document.addEventListener("DOMContentLoaded", () => {
  // Select DOM elements
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.querySelector(".chat-messages");
  const chatItems = document.querySelectorAll(".chat-item");

  // Simulated backend data for chats
  const chats = {
    "User 1": [],
    "User 2": []
  };

  let activeChat = "User 1";

  // Function to render messages for the active chat
  function renderMessages() {
    chatMessages.innerHTML = "";
    chats[activeChat].forEach(({ sender, message }) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", sender === "me" ? "sent" : "received");
      messageDiv.textContent = message;
      chatMessages.appendChild(messageDiv);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle sending a message
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;

    // Add message to the active chat
    chats[activeChat].push({ sender: "me", message });

    // Simulate recipient's reply
    setTimeout(() => {
      chats[activeChat].push({ sender: activeChat, message: "Got your message!" });
      renderMessages();
    }, 1000);

    chatInput.value = "";
    renderMessages();
  }

  // Switch active chat
  chatItems.forEach((item) => {
    item.addEventListener("click", () => {
      chatItems.forEach((chat) => chat.classList.remove("active"));
      item.classList.add("active");
      activeChat = item.textContent.trim();
      document.querySelector(".chat-header").textContent = activeChat;
      renderMessages();
    });
  });

  // Event listeners for sending messages
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Initialize the first chat
  renderMessages();
});

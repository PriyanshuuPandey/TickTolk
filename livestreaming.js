// Chat Messages and Super Chats
const chatMessages = document.getElementById("chatMessages");
const sendSuperChatBtn = document.getElementById("sendSuperChat");
const superChatToken = document.getElementById("superChatToken");
const superChatMessage = document.getElementById("superChatMessage");

// Function to Add Chat to the Display
function addChatMessage(message, isSuperChat = false, token = "") {
  const chat = document.createElement("div");
  chat.className = "chat-message";
  chat.style.padding = "10px";
  chat.style.marginBottom = "5px";
  chat.style.borderRadius = "5px";

  if (isSuperChat) {
    chat.style.backgroundColor = token === "dragon" ? "#ff0000" : "#ffd700";
    chat.style.fontWeight = "bold";
    chat.style.color = "#fff";
    chat.innerHTML = `💎 ${token.toUpperCase()}: ${message}`;
  } else {
    chat.style.backgroundColor = "#fff";
    chat.style.border = "1px solid #ddd";
    chat.innerText = message;
  }

  chatMessages.appendChild(chat);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

// Super Chat Button Click Handler
sendSuperChatBtn.addEventListener("click", () => {
  const token = superChatToken.value;
  const message = superChatMessage.value.trim();

  if (!message) {
    alert("Please enter a message.");
    return;
  }

  // Display the super chat
  addChatMessage(message, true, token);

  // Reset input
  superChatMessage.value = "";
});

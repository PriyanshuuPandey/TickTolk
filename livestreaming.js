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
    chat.innerHTML = `🎁 ${token.toUpperCase()}: ${message}`;
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
const leaderboard = {}; // {userId: totalTokens}

const updateLeaderboard = (userId, tokenValue) => {
  leaderboard[userId] = (leaderboard[userId] || 0) + tokenValue;

  // Render Leaderboard
  const leaderboardElement = document.getElementById("leaderboard");
  leaderboardElement.innerHTML = ""; // Clear existing entries
  Object.entries(leaderboard)
    .sort(([, a], [, b]) => b - a) // Sort by token value
    .forEach(([userId, totalTokens]) => {
      const entry = document.createElement("div");
      entry.textContent = `${userId}: 🪙${totalTokens}`;
      leaderboardElement.appendChild(entry);
    });
};

// Example Usage
updateLeaderboard("User123", 100); // Adds 100 tokens for User123
const tokenValues = {
  dragon: 100,
  rose: 10,
  bear: 50,
  star: 500,
  crown: 1000,                   
  Flower:15,   
  Butterfly:25,
  Candle:30,     
  Bear:50,  
  Dolphin:50,
  Dragon:100,
  Unicorn:150,
  Phoenix:200,
  Wolf:250, 
  Diamond:250,  
  Tiger:300,  
  Peacock:350,
  Eagle:400, 
  Star:500, 
  Ruby:500, 
  Lion:500,  
  Emerald:750,
  Crown:1000,  
  Sapphire:1000, 
  CrownJewels:1000,
  Castle:2000,  
  Island:5000, 
  GoldenThrone:5000,
  PrivatePlane:10000,
  Spaceship:20000,  
  Yacht:50000,
  Moon:100000,     
  LuxuryCar:150000,
  Galaxy:200000, 
};

const getTokenValue = (token) => tokenValues[token.toLowerCase()] || 0;
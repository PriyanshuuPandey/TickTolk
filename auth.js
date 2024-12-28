document.getElementById("authForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Save user credentials to localStorage (simulate signup/login)
  localStorage.setItem("username", username);
  localStorage.setItem("password", password); // This is just for demonstration; don't store passwords like this in real apps!

  alert("Login/Signup successful!");
  window.location.href = "profile.html"; // Redirect to the main profile page
});

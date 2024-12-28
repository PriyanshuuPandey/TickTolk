window.onload = function() {
  // Load existing profile data from localStorage (if any)
  const avatar = localStorage.getItem("avatar") || "https://via.placeholder.com/150";
  const username = localStorage.getItem("username") || "No username set";
  const bio = localStorage.getItem("bio") || "No bio set";

  // Pre-fill form with existing data
  document.getElementById("avatarPreview").src = avatar;
  document.getElementById("username").value = username;
  document.getElementById("bio").value = bio;

  // Avatar change preview
  const avatarInput = document.getElementById("avatar");
  avatarInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("avatarPreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Form submission to save data to localStorage
  const form = document.getElementById("editProfileForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Input Validation
    const usernameValue = document.getElementById("username").value.trim();
    const bioValue = document.getElementById("bio").value.trim();

    if (usernameValue === "" || bioValue === "") {
      alert("Please fill in all fields.");
      return;
    }

    // Save profile data to localStorage
    localStorage.setItem("avatar", document.getElementById("avatarPreview").src);
    localStorage.setItem("username", usernameValue);
    localStorage.setItem("bio", bioValue);

    // Notify the user that the profile is saved
    alert("Profile updated successfully!");
  });
};

function resetForm() {
  document.getElementById("editProfileForm").reset();
  document.getElementById("avatarPreview").src = "https://via.placeholder.com/150";
}

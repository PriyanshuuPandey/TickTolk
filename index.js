async function signUp() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Sign up successful!');
    } else {
      alert(data.message || 'Error signing up');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to connect to the server.');
  }
}

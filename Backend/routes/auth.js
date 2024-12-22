const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// User signup route
router.post('/signup', (req, res) => {
  // Handle signup logic here
  res.json({ message: 'User signed up successfully' });
});

// User login route
router.post('/login', (req, res) => {
  // Handle login logic here
  const token = jwt.sign({ id: 'user123' }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;

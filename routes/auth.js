const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (user) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }
    
    // Create new user (in a real app, you'd hash the password)
    User.create({ username, email, password }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        message: 'User created successfully', 
        user: { id: result.id, username, email } 
      });
    });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user by email (in a real app, you'd verify the hashed password)
  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      message: 'Login successful', 
      user: { id: user.id, username: user.username, email: user.email } 
    });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  });
});

module.exports = router;
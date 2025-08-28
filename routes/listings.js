const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Get all listings
router.get('/', (req, res) => {
  Listing.getAll((err, listings) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(listings);
  });
});

// Get a single listing
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Listing.getById(id, (err, listing) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  });
});

// Create a new listing
router.post('/', (req, res) => {
  const { title, description, price, category_id, user_id, image_url, location, is_free } = req.body;
  
  if (!title || !price || !category_id || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const listing = { title, description, price, category_id, user_id, image_url, location, is_free };
  
  Listing.create(listing, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.id, message: 'Listing created successfully' });
  });
});

// Get listings by category
router.get('/category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  Listing.getByCategory(categoryId, (err, listings) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(listings);
  });
});

module.exports = router;
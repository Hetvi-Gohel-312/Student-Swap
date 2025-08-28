const Listing = require('../models/Listing');
const User = require('../models/User');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

// @desc    Get all listings with filters
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFree
    } = req.query;

    // Build filter object
    const filter = { status: 'available' };
    
    if (category && category !== 'all') filter.category = category;
    if (condition) filter.condition = condition;
    if (isFree !== undefined) filter.isFree = isFree === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search in title and description
    if (search) {
      filter.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: 'seller'
    };

    const listings = await Listing.paginate(filter, options);

    res.json({
      listings: listings.docs,
      totalPages: listings.totalPages,
      currentPage: listings.page,
      totalListings: listings.totalDocs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'username email university isVerified profilePicture');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      condition,
      isFree,
      pickupLocation,
      coordinates,
      tags
    } = req.body;

    // Handle image uploads
    const images = req.files ? req.files.map(file => file.path) : [];

    const listing = new Listing({
      title,
      description,
      price: isFree ? 0 : price,
      originalPrice,
      category,
      condition,
      isFree: isFree || false,
      images,
      seller: req.user._id,
      pickupLocation,
      coordinates: coordinates ? JSON.parse(coordinates) : undefined,
      tags: tags ? tags.split(',') : []
    });

    const createdListing = await listing.save();
    await createdListing.populate('seller', 'username email university isVerified profilePicture');

    res.status(201).json(createdListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      title,
      description,
      price,
      originalPrice,
      category,
      condition,
      isFree,
      pickupLocation,
      coordinates,
      tags,
      status
    } = req.body;

    // Handle image updates
    let images = listing.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title: title || listing.title,
        description: description || listing.description,
        price: isFree ? 0 : (price || listing.price),
        originalPrice: originalPrice || listing.originalPrice,
        category: category || listing.category,
        condition: condition || listing.condition,
        isFree: isFree || listing.isFree,
        images,
        pickupLocation: pickupLocation || listing.pickupLocation,
        coordinates: coordinates ? JSON.parse(coordinates) : listing.coordinates,
        tags: tags ? tags.split(',') : listing.tags,
        status: status || listing.status
      },
      { new: true, runValidators: true }
    ).populate('seller', 'username email university isVerified profilePicture');

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's listings
// @route   GET /api/listings/user/:userId
// @access  Public
const getUserListings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { seller: userId };
    if (status) filter.status = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: 'seller'
    };

    const listings = await Listing.paginate(filter, options);

    res.json({
      listings: listings.docs,
      totalPages: listings.totalPages,
      currentPage: listings.page,
      totalListings: listings.totalDocs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate QR code for listing
// @route   GET /api/listings/:id/qrcode
// @access  Public
const generateQRCode = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const qrCodeData = {
      listingId: listing._id,
      title: listing.title,
      price: listing.price,
      seller: listing.seller
    };

    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrCodeData));
    
    res.json({ qrCode: qrCodeImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended listings
// @route   GET /api/listings/recommended
// @access  Private
const getRecommendedListings = async (req, res) => {
  try {
    // Get user's recently viewed listings or search history
    // For simplicity, we'll return listings from the same category as user's recent interactions
    const userListings = await Listing.find({ seller: req.user._id }).limit(5);
    
    let categories = [];
    if (userListings.length > 0) {
      categories = [...new Set(userListings.map(listing => listing.category))];
    } else {
      // Default categories if user has no listings
      categories = ['textbooks', 'electronics', 'furniture'];
    }

    const recommended = await Listing.find({
      category: { $in: categories },
      status: 'available',
      seller: { $ne: req.user._id } // Don't recommend user's own listings
    })
    .limit(10)
    .populate('seller', 'username email university isVerified profilePicture')
    .sort({ createdAt: -1 });

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  generateQRCode,
  getRecommendedListings
};
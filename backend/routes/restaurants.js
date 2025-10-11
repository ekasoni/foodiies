const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('cuisine').optional().isString().withMessage('Cuisine must be a string'),
  query('priceRange').optional().isIn(['$', '$$', '$$$', '$$$$']).withMessage('Invalid price range'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  query('city').optional().isString().withMessage('City must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    if (req.query.cuisine) filter.cuisine = { $in: [req.query.cuisine] };
    if (req.query.priceRange) filter.priceRange = req.query.priceRange;
    if (req.query.rating) filter.rating = { $gte: parseFloat(req.query.rating) };
    if (req.query.city) filter['address.city'] = new RegExp(req.query.city, 'i');

    const restaurants = await Restaurant.find(filter)
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Restaurant.countDocuments(filter);

    res.json({
      restaurants,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRestaurants: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'foods',
        model: 'Food',
        match: { isAvailable: true }
      });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create restaurant (restaurant owners only)
router.post('/', auth, authorize('restaurant_owner', 'admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Restaurant name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('ZIP code is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('cuisine').isArray({ min: 1 }).withMessage('At least one cuisine type is required'),
  body('priceRange').isIn(['$', '$$', '$$$', '$$$$']).withMessage('Invalid price range')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurantData = {
      ...req.body,
      owner: req.user._id
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update restaurant
router.put('/:id', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Restaurant updated successfully',
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete restaurant
router.delete('/:id', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete
    restaurant.isActive = false;
    await restaurant.save();

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search restaurants
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const restaurants = await Restaurant.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { cuisine: { $in: [new RegExp(searchQuery, 'i')] } },
            { 'address.city': { $regex: searchQuery, $options: 'i' } }
          ]
        }
      ]
    })
    .populate('owner', 'name email')
    .limit(20)
    .sort({ rating: -1 });

    res.json({ restaurants });
  } catch (error) {
    console.error('Search restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

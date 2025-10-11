const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all foods with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('cuisine').optional().isString().withMessage('Cuisine must be a string'),
  query('restaurant').optional().isMongoId().withMessage('Invalid restaurant ID'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('isVegetarian').optional().isBoolean().withMessage('isVegetarian must be a boolean'),
  query('isVegan').optional().isBoolean().withMessage('isVegan must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isAvailable: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.cuisine) filter.cuisine = new RegExp(req.query.cuisine, 'i');
    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.isVegetarian !== undefined) filter.isVegetarian = req.query.isVegetarian === 'true';
    if (req.query.isVegan !== undefined) filter.isVegan = req.query.isVegan === 'true';

    const foods = await Food.find(filter)
      .populate('restaurant', 'name address rating')
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Food.countDocuments(filter);

    res.json({
      foods,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalFoods: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurant', 'name address phone rating');

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create food (restaurant owners only)
router.post('/', auth, authorize('restaurant_owner', 'admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Food name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['appetizer', 'main_course', 'dessert', 'beverage', 'salad', 'soup', 'pizza', 'burger', 'pasta', 'seafood', 'vegetarian', 'vegan']).withMessage('Invalid category'),
  body('cuisine').notEmpty().withMessage('Cuisine is required'),
  body('restaurant').isMongoId().withMessage('Invalid restaurant ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const food = new Food(req.body);
    await food.save();

    res.status(201).json({
      message: 'Food item created successfully',
      food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food
router.put('/:id', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant');
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Check if user owns the restaurant or is admin
    if (food.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('restaurant', 'name address rating');

    res.json({
      message: 'Food item updated successfully',
      food: updatedFood
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food
router.delete('/:id', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant');
    
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Check if user owns the restaurant or is admin
    if (food.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete
    food.isAvailable = false;
    await food.save();

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search foods
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const foods = await Food.find({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { cuisine: { $regex: searchQuery, $options: 'i' } },
            { ingredients: { $in: [new RegExp(searchQuery, 'i')] } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        }
      ]
    })
    .populate('restaurant', 'name address rating')
    .limit(20)
    .sort({ rating: -1 });

    res.json({ foods });
  } catch (error) {
    console.error('Search foods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get foods by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.params.restaurantId,
      isAvailable: true
    }).populate('restaurant', 'name address rating');

    res.json({ foods });
  } catch (error) {
    console.error('Get foods by restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

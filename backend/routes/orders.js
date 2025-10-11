const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, [
  body('restaurant').isMongoId().withMessage('Invalid restaurant ID'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.food').isMongoId().withMessage('Invalid food ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').isIn(['cash', 'credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay']).withMessage('Invalid payment method'),
  body('deliveryAddress').isObject().withMessage('Delivery address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurant, items, paymentMethod, deliveryAddress, deliveryInstructions, tip = 0 } = req.body;

    // Validate restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate and calculate prices for each item
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food) {
        return res.status(404).json({ message: `Food item with ID ${item.food} not found` });
      }

      if (!food.isAvailable) {
        return res.status(400).json({ message: `Food item ${food.name} is not available` });
      }

      const itemTotal = food.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        food: food._id,
        quantity: item.quantity,
        price: food.price,
        specialInstructions: item.specialInstructions || ''
      });
    }

    // Calculate totals
    const deliveryFee = restaurantDoc.deliveryFee || 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax + tip;

    // Create order
    const order = new Order({
      customer: req.user._id,
      restaurant,
      items: validatedItems,
      subtotal,
      deliveryFee,
      tax,
      tip,
      total,
      paymentMethod,
      deliveryAddress,
      deliveryInstructions,
      estimatedDeliveryTime: new Date(Date.now() + restaurantDoc.estimatedDeliveryTime * 60000)
    });

    await order.save();

    // Populate the order with full details
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address phone')
      .populate('items.food', 'name price description');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { customer: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('restaurant', 'name address phone')
      .populate('items.food', 'name price description')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address phone')
      .populate('items.food', 'name price description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (order.customer._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'restaurant_owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (restaurant owners and admins)
router.put('/:id/status', auth, authorize('restaurant_owner', 'admin'), [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id).populate('restaurant');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the restaurant or is admin
    if (order.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = req.body.status;
    
    // Set actual delivery time when status is delivered
    if (req.body.status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can cancel this order
    if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant orders (restaurant owners)
router.get('/restaurant/:restaurantId', auth, authorize('restaurant_owner', 'admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { restaurant: req.params.restaurantId };
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.food', 'name price description')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

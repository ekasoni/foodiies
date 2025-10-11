const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'salad', 'soup', 'pizza', 'burger', 'pasta', 'seafood', 'vegetarian', 'vegan']
  },
  cuisine: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'fish', 'shellfish', 'sesame']
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  images: [{
    type: String
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  preparationTime: {
    type: Number,
    default: 15
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);

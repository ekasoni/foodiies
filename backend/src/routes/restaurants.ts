import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      cuisine = '', 
      city = '',
      minRating = 0,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      isActive: true,
      isApproved: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (cuisine) {
      where.cuisine = cuisine;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (minRating) {
      where.rating = { gte: Number(minRating) };
    }

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [restaurants, total] = await Promise.all([
      prisma.restaurantProfile.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          menuItems: {
            where: { isAvailable: true },
            take: 5
          },
          _count: {
            select: {
              reviews: true,
              menuItems: true
            }
          }
        }
      }),
      prisma.restaurantProfile.count({ where })
    ]);

    res.json({
      success: true,
      restaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurantProfile.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { category: 'asc' }
        },
        reviews: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            menuItems: true
          }
        }
      }
    });

    if (!restaurant || !restaurant.isActive || !restaurant.isApproved) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/restaurants
// @desc    Create restaurant profile
// @access  Private (Restaurant role)
router.post('/', authenticate, authorize('RESTAURANT'), async (req: AuthRequest, res) => {
  try {
    const {
      name,
      description,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      openingHours
    } = req.body;

    // Check if user already has a restaurant profile
    const existingRestaurant = await prisma.restaurantProfile.findUnique({
      where: { userId: req.user!.id }
    });

    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant profile already exists' });
    }

    const restaurant = await prisma.restaurantProfile.create({
      data: {
        userId: req.user!.id,
        name,
        description,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        latitude,
        longitude,
        openingHours
      }
    });

    res.status(201).json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant profile
// @access  Private (Restaurant owner)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if restaurant belongs to user
    const existingRestaurant = await prisma.restaurantProfile.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!existingRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurant = await prisma.restaurantProfile.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/nearby
// @desc    Get nearby restaurants
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // This is a simplified version. In production, you'd use PostGIS for proper geospatial queries
    const restaurants = await prisma.restaurantProfile.findMany({
      where: {
        isActive: true,
        isApproved: true,
        latitude: {
          gte: Number(latitude) - Number(radius) / 111, // Rough conversion
          lte: Number(latitude) + Number(radius) / 111
        },
        longitude: {
          gte: Number(longitude) - Number(radius) / 111,
          lte: Number(longitude) + Number(radius) / 111
        }
      },
      include: {
        _count: {
          select: {
            reviews: true,
            menuItems: true
          }
        }
      }
    });

    res.json({
      success: true,
      restaurants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
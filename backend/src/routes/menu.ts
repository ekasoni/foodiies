import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/menu/restaurant/:restaurantId
// @desc    Get menu items for a restaurant
// @access  Public
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category = '', search = '' } = req.query;

    const where: any = {
      restaurantId,
      isAvailable: true
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    // Group by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    res.json({
      success: true,
      menuItems: groupedMenu,
      categories: Object.keys(groupedMenu)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/menu/item/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true
          }
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
            reviews: true
          }
        }
      }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/menu
// @desc    Create menu item
// @access  Private (Restaurant owner)
router.post('/', authenticate, authorize('RESTAURANT'), async (req: AuthRequest, res) => {
  try {
    const {
      restaurantId,
      name,
      description,
      price,
      image,
      category,
      isVegetarian,
      isVegan,
      isGlutenFree,
      allergens
    } = req.body;

    // Check if restaurant belongs to user
    const restaurant = await prisma.restaurantProfile.findFirst({
      where: { id: restaurantId, userId: req.user!.id }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        name,
        description,
        price,
        image,
        category,
        isVegetarian: isVegetarian || false,
        isVegan: isVegan || false,
        isGlutenFree: isGlutenFree || false,
        allergens: allergens || []
      }
    });

    res.status(201).json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Restaurant owner)
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if menu item belongs to user's restaurant
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id,
        restaurant: {
          userId: req.user!.id
        }
      }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private (Restaurant owner)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if menu item belongs to user's restaurant
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id,
        restaurant: {
          userId: req.user!.id
        }
      }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/menu/categories
// @desc    Get all menu categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.menuItem.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { isAvailable: true }
    });

    res.json({
      success: true,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
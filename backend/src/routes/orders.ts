import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      specialInstructions
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Get restaurant details
    const restaurant = await prisma.restaurantProfile.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item ${item.menuItemId} not available` });
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = 2.99; // Fixed delivery fee
    const total = subtotal + tax + deliveryFee;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: req.user!.id,
        restaurantId,
        subtotal,
        tax,
        deliveryFee,
        total,
        deliveryAddress,
        specialInstructions,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`restaurant_${restaurantId}`).emit('new_order', order);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      customerId: req.user!.id
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      orders,
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

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        customerId: req.user!.id
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true,
            address: true
          }
        },
        payment: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Restaurant owner)
router.put('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if order belongs to user's restaurant
    const order = await prisma.order.findFirst({
      where: {
        id,
        restaurant: {
          userId: req.user!.id
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order_${id}`).emit('order_status_update', updatedOrder);

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/restaurant/:restaurantId
// @desc    Get restaurant orders
// @access  Private (Restaurant owner)
router.get('/restaurant/:restaurantId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Check if restaurant belongs to user
    const restaurant = await prisma.restaurantProfile.findFirst({
      where: { id: restaurantId, userId: req.user!.id }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const where: any = {
      restaurantId
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              menuItem: true
            }
          },
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      orders,
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

export default router;
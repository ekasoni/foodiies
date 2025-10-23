import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      restaurantId,
      menuItemId,
      orderId,
      rating,
      comment
    } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has ordered from this restaurant
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          customerId: req.user!.id,
          status: 'DELIVERED'
        }
      });

      if (!order) {
        return res.status(400).json({ message: 'Order not found or not delivered' });
      }
    }

    // Check if user already reviewed this restaurant/item
    const existingReview = await prisma.review.findFirst({
      where: {
        customerId: req.user!.id,
        restaurantId: restaurantId || undefined,
        menuItemId: menuItemId || undefined
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const review = await prisma.review.create({
      data: {
        customerId: req.user!.id,
        restaurantId: restaurantId || null,
        menuItemId: menuItemId || null,
        orderId: orderId || null,
        rating,
        comment
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Update restaurant/item ratings
    if (restaurantId) {
      await updateRestaurantRating(restaurantId);
    }

    if (menuItemId) {
      await updateMenuItemRating(menuItemId);
    }

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/restaurant/:restaurantId
// @desc    Get restaurant reviews
// @access  Public
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          restaurantId,
          menuItemId: null // Only restaurant reviews, not menu item reviews
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.review.count({
        where: {
          restaurantId,
          menuItemId: null
        }
      })
    ]);

    res.json({
      success: true,
      reviews,
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

// @route   GET /api/reviews/menu-item/:menuItemId
// @desc    Get menu item reviews
// @access  Public
router.get('/menu-item/:menuItemId', async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { menuItemId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.review.count({
        where: { menuItemId }
      })
    ]);

    res.json({
      success: true,
      reviews,
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

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findFirst({
      where: {
        id,
        customerId: req.user!.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating, comment },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Update ratings
    if (review.restaurantId) {
      await updateRestaurantRating(review.restaurantId);
    }

    if (review.menuItemId) {
      await updateMenuItemRating(review.menuItemId);
    }

    res.json({
      success: true,
      review: updatedReview
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findFirst({
      where: {
        id,
        customerId: req.user!.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await prisma.review.delete({
      where: { id }
    });

    // Update ratings
    if (review.restaurantId) {
      await updateRestaurantRating(review.restaurantId);
    }

    if (review.menuItemId) {
      await updateMenuItemRating(review.menuItemId);
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update restaurant rating
async function updateRestaurantRating(restaurantId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      restaurantId,
      menuItemId: null
    },
    select: { rating: true }
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await prisma.restaurantProfile.update({
    where: { id: restaurantId },
    data: {
      rating: averageRating,
      totalReviews: reviews.length
    }
  });
}

// Helper function to update menu item rating
async function updateMenuItemRating(menuItemId: string) {
  const reviews = await prisma.review.findMany({
    where: { menuItemId },
    select: { rating: true }
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      rating: averageRating,
      totalReviews: reviews.length
    }
  });
}

export default router;
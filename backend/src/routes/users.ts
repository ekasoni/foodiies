import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        customerProfile: true,
        restaurantProfile: true,
        addresses: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        customerProfile: true,
        restaurantProfile: true,
        addresses: true
      }
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        phone
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true
      }
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', authenticate, async (req: AuthRequest, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, street, city, state, zipCode, country, latitude, longitude, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        type,
        street,
        city,
        state,
        zipCode,
        country,
        latitude,
        longitude,
        isDefault
      }
    });

    res.status(201).json({
      success: true,
      address
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/addresses/:id
// @desc    Update address
// @access  Private
router.put('/addresses/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { type, street, city, state, zipCode, country, latitude, longitude, isDefault } = req.body;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!existingAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        type,
        street,
        city,
        state,
        zipCode,
        country,
        latitude,
        longitude,
        isDefault
      }
    });

    res.json({
      success: true,
      address
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/addresses/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!existingAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await prisma.address.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
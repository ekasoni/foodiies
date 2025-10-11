import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
});

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
        recipes: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                favorites: true,
                reviews: true,
              },
            },
          },
        },
        _count: {
          select: {
            recipes: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse recipe JSON fields
    const parsedRecipes = user.recipes.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    }));

    res.json({
      user: {
        ...user,
        recipes: parsedRecipes,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: req.user.id },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          recipe: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              _count: {
                select: {
                  favorites: true,
                  reviews: true,
                },
              },
            },
          },
        },
      }),
      prisma.favorite.count({
        where: { userId: req.user.id },
      }),
    ]);

    // Parse recipe JSON fields
    const parsedFavorites = favorites.map(favorite => ({
      ...favorite,
      recipe: {
        ...favorite.recipe,
        ingredients: JSON.parse(favorite.recipe.ingredients),
        instructions: JSON.parse(favorite.recipe.instructions),
        tags: favorite.recipe.tags ? JSON.parse(favorite.recipe.tags) : [],
      },
    }));

    res.json({
      favorites: parsedFavorites,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
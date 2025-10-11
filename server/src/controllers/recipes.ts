import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  ingredients: z.array(z.string().min(1)),
  instructions: z.array(z.string().min(1)),
  prepTime: z.number().int().positive(),
  cookTime: z.number().int().positive(),
  servings: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

const updateRecipeSchema = createRecipeSchema.partial();

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = createRecipeSchema.parse(req.body);

    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        ingredients: JSON.stringify(data.ingredients),
        instructions: JSON.stringify(data.instructions),
        tags: data.tags ? JSON.stringify(data.tags) : null,
        authorId: req.user.id,
      },
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
    });

    // Parse JSON fields for response
    const parsedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    };

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe: parsedRecipe,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '12',
      category,
      difficulty,
      search,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (tags) {
      const tagArray = (tags as string).split(',');
      where.tags = {
        contains: tagArray[0], // Simple implementation - could be improved
      };
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc',
        },
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
      }),
      prisma.recipe.count({ where }),
    ]);

    // Parse JSON fields
    const parsedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    }));

    res.json({
      recipes: parsedRecipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
        favorites: req.user ? {
          where: { userId: req.user.id },
          select: { id: true },
        } : false,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Calculate average rating
    const avgRating = recipe.reviews.length > 0
      ? recipe.reviews.reduce((sum, review) => sum + review.rating, 0) / recipe.reviews.length
      : 0;

    const parsedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
      isFavorited: req.user ? recipe.favorites.length > 0 : false,
      avgRating: Math.round(avgRating * 10) / 10,
    };

    res.json({ recipe: parsedRecipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const data = updateRecipeSchema.parse(req.body);

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (existingRecipe.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    // Prepare update data
    const updateData: any = { ...data };
    if (data.ingredients) updateData.ingredients = JSON.stringify(data.ingredients);
    if (data.instructions) updateData.instructions = JSON.stringify(data.instructions);
    if (data.tags) updateData.tags = JSON.stringify(data.tags);

    const recipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
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
    });

    const parsedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    };

    res.json({
      message: 'Recipe updated successfully',
      recipe: parsedRecipe,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (existingRecipe.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await prisma.recipe.delete({
      where: { id },
    });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: req.user.id,
          recipeId: id,
        },
      },
    });

    let isFavorited: boolean;

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      isFavorited = false;
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: req.user.id,
          recipeId: id,
        },
      });
      isFavorited = true;
    }

    res.json({
      message: isFavorited ? 'Recipe added to favorites' : 'Recipe removed from favorites',
      isFavorited,
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
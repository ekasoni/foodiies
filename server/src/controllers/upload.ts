import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import path from 'path';

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRecipeImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true, image: true },
    });

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (existingRecipe.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Update recipe with new image
    const recipe = await prisma.recipe.update({
      where: { id },
      data: { image: imageUrl },
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
      },
    });

    res.json({
      message: 'Recipe image updated successfully',
      recipe: {
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients),
        instructions: JSON.parse(recipe.instructions),
        tags: recipe.tags ? JSON.parse(recipe.tags) : [],
      },
    });
  } catch (error) {
    console.error('Update recipe image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
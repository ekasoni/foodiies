"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecipeImage = exports.uploadImage = void 0;
const prisma_1 = require("../lib/prisma");
const uploadImage = async (req, res) => {
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
    }
    catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.uploadImage = uploadImage;
const updateRecipeImage = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const existingRecipe = await prisma_1.prisma.recipe.findUnique({
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
        const recipe = await prisma_1.prisma.recipe.update({
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
    }
    catch (error) {
        console.error('Update recipe image error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateRecipeImage = updateRecipeImage;
//# sourceMappingURL=upload.js.map
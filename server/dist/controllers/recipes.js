"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = exports.deleteRecipe = exports.updateRecipe = exports.getRecipe = exports.getRecipes = exports.createRecipe = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const createRecipeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(1000),
    ingredients: zod_1.z.array(zod_1.z.string().min(1)),
    instructions: zod_1.z.array(zod_1.z.string().min(1)),
    prepTime: zod_1.z.number().int().positive(),
    cookTime: zod_1.z.number().int().positive(),
    servings: zod_1.z.number().int().positive(),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard']),
    category: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
const updateRecipeSchema = createRecipeSchema.partial();
const createRecipe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const data = createRecipeSchema.parse(req.body);
        const recipe = await prisma_1.prisma.recipe.create({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Create recipe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createRecipe = createRecipe;
const getRecipes = async (req, res) => {
    try {
        const { page = '1', limit = '12', category, difficulty, search, tags, sortBy = 'createdAt', sortOrder = 'desc', } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (category)
            where.category = category;
        if (difficulty)
            where.difficulty = difficulty;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (tags) {
            const tagArray = tags.split(',');
            where.tags = {
                contains: tagArray[0],
            };
        }
        const [recipes, total] = await Promise.all([
            prisma_1.prisma.recipe.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: {
                    [sortBy]: sortOrder,
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
            prisma_1.prisma.recipe.count({ where }),
        ]);
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
    }
    catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getRecipes = getRecipes;
const getRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await prisma_1.prisma.recipe.findUnique({
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
    }
    catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getRecipe = getRecipe;
const updateRecipe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const data = updateRecipeSchema.parse(req.body);
        const existingRecipe = await prisma_1.prisma.recipe.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (!existingRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        if (existingRecipe.authorId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }
        const updateData = { ...data };
        if (data.ingredients)
            updateData.ingredients = JSON.stringify(data.ingredients);
        if (data.instructions)
            updateData.instructions = JSON.stringify(data.instructions);
        if (data.tags)
            updateData.tags = JSON.stringify(data.tags);
        const recipe = await prisma_1.prisma.recipe.update({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Update recipe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateRecipe = updateRecipe;
const deleteRecipe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const existingRecipe = await prisma_1.prisma.recipe.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (!existingRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        if (existingRecipe.authorId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }
        await prisma_1.prisma.recipe.delete({
            where: { id },
        });
        res.json({ message: 'Recipe deleted successfully' });
    }
    catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteRecipe = deleteRecipe;
const toggleFavorite = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params;
        const recipe = await prisma_1.prisma.recipe.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const existingFavorite = await prisma_1.prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId: req.user.id,
                    recipeId: id,
                },
            },
        });
        let isFavorited;
        if (existingFavorite) {
            await prisma_1.prisma.favorite.delete({
                where: { id: existingFavorite.id },
            });
            isFavorited = false;
        }
        else {
            await prisma_1.prisma.favorite.create({
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
    }
    catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.toggleFavorite = toggleFavorite;
//# sourceMappingURL=recipes.js.map
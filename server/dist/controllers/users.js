"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.updateProfile = exports.getUserProfile = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional(),
    bio: zod_1.z.string().max(500).optional(),
    avatar: zod_1.z.string().optional(),
});
const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await prisma_1.prisma.user.findUnique({
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
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserProfile = getUserProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const data = updateProfileSchema.parse(req.body);
        const user = await prisma_1.prisma.user.update({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
const getFavorites = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { page = '1', limit = '12', } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const [favorites, total] = await Promise.all([
            prisma_1.prisma.favorite.findMany({
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
            prisma_1.prisma.favorite.count({
                where: { userId: req.user.id },
            }),
        ]);
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
    }
    catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFavorites = getFavorites;
//# sourceMappingURL=users.js.map
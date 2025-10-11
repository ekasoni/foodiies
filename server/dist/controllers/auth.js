"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../utils/auth");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3).max(20),
    firstName: zod_1.z.string().min(1).max(50),
    lastName: zod_1.z.string().min(1).max(50),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const register = async (req, res) => {
    try {
        const { email, username, firstName, lastName, password } = registerSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken',
            });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                username,
                firstName,
                lastName,
                password: hashedPassword,
            },
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
        const token = (0, auth_1.generateToken)(user.id);
        res.status(201).json({
            message: 'User registered successfully',
            user,
            token,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = (0, auth_1.generateToken)(user.id);
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                bio: user.bio,
                createdAt: user.createdAt,
            },
            token,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.errors,
            });
        }
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                createdAt: true,
                recipes: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        image: true,
                        createdAt: true,
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
        res.json({ user });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=auth.js.map
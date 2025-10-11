import { Router } from 'express';
import { getUserProfile, updateProfile, getFavorites } from '../controllers/users';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile/:username', getUserProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/favorites', authenticate, getFavorites);

export default router;
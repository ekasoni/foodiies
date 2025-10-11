import { Router } from 'express';
import {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
} from '../controllers/recipes';
import { uploadImage, updateRecipeImage } from '../controllers/upload';
import { authenticate, optionalAuth } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = Router();

router.get('/', optionalAuth, getRecipes);
router.get('/:id', optionalAuth, getRecipe);
router.post('/', authenticate, createRecipe);
router.put('/:id', authenticate, updateRecipe);
router.delete('/:id', authenticate, deleteRecipe);
router.post('/:id/favorite', authenticate, toggleFavorite);
router.post('/upload', authenticate, uploadSingle, uploadImage);
router.put('/:id/image', authenticate, uploadSingle, updateRecipeImage);

export default router;
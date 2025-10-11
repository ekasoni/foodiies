"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipes_1 = require("../controllers/recipes");
const upload_1 = require("../controllers/upload");
const auth_1 = require("../middleware/auth");
const upload_2 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.get('/', auth_1.optionalAuth, recipes_1.getRecipes);
router.get('/:id', auth_1.optionalAuth, recipes_1.getRecipe);
router.post('/', auth_1.authenticate, recipes_1.createRecipe);
router.put('/:id', auth_1.authenticate, recipes_1.updateRecipe);
router.delete('/:id', auth_1.authenticate, recipes_1.deleteRecipe);
router.post('/:id/favorite', auth_1.authenticate, recipes_1.toggleFavorite);
router.post('/upload', auth_1.authenticate, upload_2.uploadSingle, upload_1.uploadImage);
router.put('/:id/image', auth_1.authenticate, upload_2.uploadSingle, upload_1.updateRecipeImage);
exports.default = router;
//# sourceMappingURL=recipes.js.map
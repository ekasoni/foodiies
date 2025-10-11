"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/profile/:username', users_1.getUserProfile);
router.put('/profile', auth_1.authenticate, users_1.updateProfile);
router.get('/favorites', auth_1.authenticate, users_1.getFavorites);
exports.default = router;
//# sourceMappingURL=users.js.map
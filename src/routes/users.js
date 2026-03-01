import express from 'express';
import { UserController } from '../controllers/userController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const userController = new UserController();

router.get('/profile', asyncHandler((req, res) => userController.getUserProfile(req, res)));
router.put('/profile', asyncHandler((req, res) => userController.updateUserProfile(req, res)));
router.get('/stats', asyncHandler((req, res) => userController.getUserStats(req, res)));
router.get('/achievements', asyncHandler((req, res) => userController.getAchievements(req, res)));
router.post('/export-data', asyncHandler((req, res) => userController.exportUserData(req, res)));
router.post('/import-data', asyncHandler((req, res) => userController.importUserData(req, res)));

export default router;

import express from 'express';
import { PracticeController } from '../controllers/practiceController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const practiceController = new PracticeController();

router.get('/mode/:mode', asyncHandler((req, res) => practiceController.getPracticeByMode(req, res)));
router.post('/session', asyncHandler((req, res) => practiceController.createPracticeSession(req, res)));
router.post('/session/:sessionId/complete', asyncHandler((req, res) => practiceController.completePracticeSession(req, res)));
router.get('/history', asyncHandler((req, res) => practiceController.getPracticeHistory(req, res)));

export default router;

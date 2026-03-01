import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const analyticsController = new AnalyticsController();

router.get('/dashboard', asyncHandler((req, res) => analyticsController.getDashboard(req, res)));
router.get('/learning-stats', asyncHandler((req, res) => analyticsController.getLearningStats(req, res)));
router.get('/performance', asyncHandler((req, res) => analyticsController.getPerformanceMetrics(req, res)));
router.post('/track-event', asyncHandler((req, res) => analyticsController.trackEvent(req, res)));

export default router;

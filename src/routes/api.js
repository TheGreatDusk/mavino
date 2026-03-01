import express from 'express';
import courseRouter from './courses.js';
import lessonsRouter from './lessons.js';
import practiceRouter from './practice.js';
import userRouter from './users.js';
import audioRouter from './audio.js';
import analyticsRouter from './analytics.js';

const router = express.Router();

router.use('/courses', courseRouter);
router.use('/lessons', lessonsRouter);
router.use('/practice', practiceRouter);
router.use('/users', userRouter);
router.use('/audio', audioRouter);
router.use('/analytics', analyticsRouter);

export default router;

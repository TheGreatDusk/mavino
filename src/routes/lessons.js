import express from 'express';
import { LessonController } from '../controllers/lessonController.js';
import { validateLessonData } from '../middleware/validation.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const lessonController = new LessonController();

router.get('/course/:courseId', asyncHandler((req, res) => lessonController.getLessonsByCourse(req, res)));
router.get('/:lessonId', asyncHandler((req, res) => lessonController.getLessonById(req, res)));
router.post('/', validateLessonData, asyncHandler((req, res) => lessonController.createLesson(req, res)));
router.put('/:lessonId', validateLessonData, asyncHandler((req, res) => lessonController.updateLesson(req, res)));
router.delete('/:lessonId', asyncHandler((req, res) => lessonController.deleteLesson(req, res)));
router.post('/:lessonId/complete', asyncHandler((req, res) => lessonController.completeLesson(req, res)));

export default router;

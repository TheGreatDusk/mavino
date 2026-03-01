import express from 'express';
import { CourseController } from '../controllers/courseController.js';
import { validateCourseData } from '../middleware/validation.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const courseController = new CourseController();

router.get('/', asyncHandler((req, res) => courseController.getAllCourses(req, res)));
router.get('/:courseId', asyncHandler((req, res) => courseController.getCourseById(req, res)));
router.post('/', validateCourseData, asyncHandler((req, res) => courseController.createCourse(req, res)));
router.put('/:courseId', validateCourseData, asyncHandler((req, res) => courseController.updateCourse(req, res)));
router.delete('/:courseId', asyncHandler((req, res) => courseController.deleteCourse(req, res)));
router.get('/:courseId/progress', asyncHandler((req, res) => courseController.getCourseProgress(req, res)));
router.post('/:courseId/duplicate', asyncHandler((req, res) => courseController.duplicateCourse(req, res)));

export default router;

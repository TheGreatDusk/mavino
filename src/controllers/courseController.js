import { v4 as uuidv4 } from 'uuid';
import CourseService from '../services/courseService.js';
import { AppError } from '../utils/errors.js';

export class CourseController {
  constructor() {
    this.courseService = new CourseService();
  }

  async getAllCourses(req, res) {
    try {
      const { filter, sort, limit = 20, offset = 0 } = req.query;
      const courses = await this.courseService.getAllCourses({
        filter,
        sort,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: courses,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: courses.length
        }
      });
    } catch (error) {
      throw new AppError('Failed to fetch courses', 500, error);
    }
  }

  async getCourseById(req, res) {
    try {
      const { courseId } = req.params;
      if (!courseId) throw new AppError('Course ID is required', 400);

      const course = await this.courseService.getCourseById(courseId);
      if (!course) throw new AppError('Course not found', 404);

      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch course', 500, error);
    }
  }

  async createCourse(req, res) {
    try {
      const { title, description, difficulty, category, color } = req.body;

      if (!title || !description) {
        throw new AppError('Title and description are required', 400);
      }

      const newCourse = {
        id: uuidv4(),
        title,
        description,
        difficulty: difficulty || 'beginner',
        category: category || 'general',
        color: color || '#1f77b4',
        units: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          lessonsCount: 0,
          studentsEnrolled: 0,
          averageRating: 0
        }
      };

      const createdCourse = await this.courseService.createCourse(newCourse);

      res.status(201).json({
        success: true,
        data: createdCourse,
        message: 'Course created successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create course', 500, error);
    }
  }

  async updateCourse(req, res) {
    try {
      const { courseId } = req.params;
      const updates = req.body;

      if (!courseId) throw new AppError('Course ID is required', 400);

      const updatedCourse = await this.courseService.updateCourse(courseId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      if (!updatedCourse) throw new AppError('Course not found', 404);

      res.json({
        success: true,
        data: updatedCourse,
        message: 'Course updated successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update course', 500, error);
    }
  }

  async deleteCourse(req, res) {
    try {
      const { courseId } = req.params;
      if (!courseId) throw new AppError('Course ID is required', 400);

      const result = await this.courseService.deleteCourse(courseId);
      if (!result) throw new AppError('Course not found', 404);

      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete course', 500, error);
    }
  }

  async getCourseProgress(req, res) {
    try {
      const { courseId } = req.params;
      if (!courseId) throw new AppError('Course ID is required', 400);

      const progress = await this.courseService.getCourseProgress(courseId);

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      throw new AppError('Failed to fetch course progress', 500, error);
    }
  }

  async duplicateCourse(req, res) {
    try {
      const { courseId } = req.params;
      if (!courseId) throw new AppError('Course ID is required', 400);

      const duplicatedCourse = await this.courseService.duplicateCourse(courseId);
      if (!duplicatedCourse) throw new AppError('Course not found', 404);

      res.status(201).json({
        success: true,
        data: duplicatedCourse,
        message: 'Course duplicated successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to duplicate course', 500, error);
    }
  }
}

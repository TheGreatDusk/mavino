import { v4 as uuidv4 } from 'uuid';
import LessonService from '../services/lessonService.js';
import { AppError } from '../utils/errors.js';

export class LessonController {
  constructor() {
    this.lessonService = new LessonService();
  }

  async getLessonsByCourse(req, res) {
    try {
      const { courseId } = req.params;
      if (!courseId) throw new AppError('Course ID is required', 400);

      const lessons = await this.lessonService.getLessonsByCourse(courseId);

      res.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      throw new AppError('Failed to fetch lessons', 500, error);
    }
  }

  async getLessonById(req, res) {
    try {
      const { lessonId } = req.params;
      if (!lessonId) throw new AppError('Lesson ID is required', 400);

      const lesson = await this.lessonService.getLessonById(lessonId);
      if (!lesson) throw new AppError('Lesson not found', 404);

      res.json({
        success: true,
        data: lesson
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch lesson', 500, error);
    }
  }

  async createLesson(req, res) {
    try {
      const { courseId, title, description, type, content, difficulty } = req.body;

      if (!courseId || !title || !type) {
        throw new AppError('Course ID, title, and type are required', 400);
      }

      const validTypes = ['scale', 'chord', 'rhythm', 'melody', 'composition', 'theory'];
      if (!validTypes.includes(type)) {
        throw new AppError(`Invalid lesson type. Must be one of: ${validTypes.join(', ')}`, 400);
      }

      const newLesson = {
        id: uuidv4(),
        courseId,
        title,
        description: description || '',
        type,
        content: content || {},
        difficulty: difficulty || 'beginner',
        questions: [],
        estimatedDuration: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          attempts: 0,
          averageScore: 0,
          completionRate: 0
        }
      };

      const createdLesson = await this.lessonService.createLesson(newLesson);

      res.status(201).json({
        success: true,
        data: createdLesson,
        message: 'Lesson created successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create lesson', 500, error);
    }
  }

  async updateLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const updates = req.body;

      if (!lessonId) throw new AppError('Lesson ID is required', 400);

      const updatedLesson = await this.lessonService.updateLesson(lessonId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      if (!updatedLesson) throw new AppError('Lesson not found', 404);

      res.json({
        success: true,
        data: updatedLesson,
        message: 'Lesson updated successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update lesson', 500, error);
    }
  }

  async deleteLesson(req, res) {
    try {
      const { lessonId } = req.params;
      if (!lessonId) throw new AppError('Lesson ID is required', 400);

      const result = await this.lessonService.deleteLesson(lessonId);
      if (!result) throw new AppError('Lesson not found', 404);

      res.json({
        success: true,
        message: 'Lesson deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete lesson', 500, error);
    }
  }

  async completeLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const { score, timeSpent } = req.body;

      if (!lessonId) throw new AppError('Lesson ID is required', 400);

      const completion = await this.lessonService.completeLesson(lessonId, {
        score: score || 0,
        timeSpent: timeSpent || 0,
        completedAt: new Date().toISOString()
      });

      res.json({
        success: true,
        data: completion,
        message: 'Lesson completed successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to complete lesson', 500, error);
    }
  }
}

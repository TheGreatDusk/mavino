import { v4 as uuidv4 } from 'uuid';
import PracticeService from '../services/practiceService.js';
import { AppError } from '../utils/errors.js';

export class PracticeController {
  constructor() {
    this.practiceService = new PracticeService();
  }

  async getPracticeByMode(req, res) {
    try {
      const { mode } = req.params;
      const validModes = ['personalized', 'review', 'ear-training', 'composition'];

      if (!validModes.includes(mode)) {
        throw new AppError(`Invalid practice mode. Must be one of: ${validModes.join(', ')}`, 400);
      }

      const practice = await this.practiceService.getPracticeByMode(mode);

      res.json({
        success: true,
        data: practice
      });
    } catch (error) {
      throw new AppError('Failed to fetch practice', 500, error);
    }
  }

  async createPracticeSession(req, res) {
    try {
      const { mode, courseId, difficulty } = req.body;

      if (!mode) throw new AppError('Practice mode is required', 400);

      const validModes = ['personalized', 'review', 'ear-training', 'composition'];
      if (!validModes.includes(mode)) {
        throw new AppError(`Invalid practice mode. Must be one of: ${validModes.join(', ')}`, 400);
      }

      const sessionId = uuidv4();
      const session = {
        id: sessionId,
        mode,
        courseId,
        difficulty: difficulty || 'beginner',
        startedAt: new Date().toISOString(),
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        status: 'active'
      };

      const createdSession = await this.practiceService.createSession(session);

      res.status(201).json({
        success: true,
        data: createdSession,
        message: 'Practice session created successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create practice session', 500, error);
    }
  }

  async completePracticeSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { finalScore, answers } = req.body;

      if (!sessionId) throw new AppError('Session ID is required', 400);

      const completion = await this.practiceService.completeSession(sessionId, {
        finalScore,
        answers,
        completedAt: new Date().toISOString(),
        status: 'completed'
      });

      if (!completion) throw new AppError('Session not found', 404);

      res.json({
        success: true,
        data: completion,
        message: 'Practice session completed successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to complete practice session', 500, error);
    }
  }

  async getPracticeHistory(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const history = await this.practiceService.getHistory({
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: history,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      throw new AppError('Failed to fetch practice history', 500, error);
    }
  }
}

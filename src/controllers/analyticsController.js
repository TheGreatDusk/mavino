import AnalyticsService from '../services/analyticsService.js';
import { AppError } from '../utils/errors.js';

export class AnalyticsController {
  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  async getDashboard(req, res) {
    try {
      const { period = '7d' } = req.query;

      const dashboard = await this.analyticsService.getDashboard(period);

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      throw new AppError('Failed to fetch dashboard data', 500, error);
    }
  }

  async getLearningStats(req, res) {
    try {
      const stats = await this.analyticsService.getLearningStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      throw new AppError('Failed to fetch learning stats', 500, error);
    }
  }

  async getPerformanceMetrics(req, res) {
    try {
      const { courseId } = req.query;

      const metrics = await this.analyticsService.getPerformanceMetrics(courseId);

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      throw new AppError('Failed to fetch performance metrics', 500, error);
    }
  }

  async trackEvent(req, res) {
    try {
      const { eventType, eventData } = req.body;

      if (!eventType) throw new AppError('Event type is required', 400);

      const tracked = await this.analyticsService.trackEvent({
        eventType,
        eventData,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        data: tracked,
        message: 'Event tracked successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to track event', 500, error);
    }
  }
}

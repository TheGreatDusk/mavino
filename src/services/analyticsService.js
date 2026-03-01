import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

export default class AnalyticsService {
  async getDashboard(period = '7d') {
    try {
      const analytics = await this.readAnalytics();

      const days = this.getPeriodDays(period);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const filteredEvents = analytics.events.filter(e =>
        new Date(e.timestamp) >= cutoffDate
      );

      return {
        period,
        totalSessions: filteredEvents.length,
        sessionsPerDay: this.groupByDay(filteredEvents),
        topCourses: this.getTopCourses(filteredEvents),
        averageScore: this.calculateAverageScore(filteredEvents),
        streak: this.calculateStreak(filteredEvents),
        xpGained: this.calculateXPGained(filteredEvents)
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      return null;
    }
  }

  async getLearningStats() {
    try {
      const analytics = await this.readAnalytics();

      return {
        totalLessonsCompleted: analytics.stats?.totalLessonsCompleted || 0,
        totalTimeSpent: analytics.stats?.totalTimeSpent || 0,
        averageScore: analytics.stats?.averageScore || 0,
        lessonsThisWeek: analytics.stats?.lessonsThisWeek || 0,
        currentStreak: analytics.stats?.currentStreak || 0,
        bestStreak: analytics.stats?.bestStreak || 0,
        level: analytics.stats?.level || 1,
        xp: analytics.stats?.xp || 0
      };
    } catch (error) {
      console.error('Error fetching learning stats:', error);
      return null;
    }
  }

  async getPerformanceMetrics(courseId) {
    try {
      const analytics = await this.readAnalytics();

      const courseEvents = courseId
        ? analytics.events.filter(e => e.courseId === courseId)
        : analytics.events;

      return {
        totalAttempts: courseEvents.length,
        averageScore: this.calculateAverageScore(courseEvents),
        improvementRate: this.calculateImprovementRate(courseEvents),
        timePerLesson: this.calculateAverageTimePerLesson(courseEvents),
        topicPerformance: this.getTopicPerformance(courseEvents)
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return null;
    }
  }

  async trackEvent(eventData) {
    try {
      let analytics = await this.readAnalytics();

      if (!analytics.events) {
        analytics.events = [];
      }

      analytics.events.push(eventData);

      await this.writeAnalytics(analytics);

      return {
        success: true,
        eventId: eventData.eventType + '_' + Date.now()
      };
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  getPeriodDays(period) {
    const mapping = {
      '7d': 7,
      '14d': 14,
      '30d': 30,
      '90d': 90
    };
    return mapping[period] || 7;
  }

  groupByDay(events) {
    const grouped = {};

    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return grouped;
  }

  getTopCourses(events) {
    const courseMap = {};

    events.forEach(event => {
      if (event.courseId) {
        courseMap[event.courseId] = (courseMap[event.courseId] || 0) + 1;
      }
    });

    return Object.entries(courseMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([courseId, count]) => ({ courseId, count }));
  }

  calculateAverageScore(events) {
    if (events.length === 0) return 0;

    const scores = events.filter(e => e.eventData?.score !== undefined).map(e => e.eventData.score);

    if (scores.length === 0) return 0;

    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  calculateStreak(events) {
    if (events.length === 0) return 0;

    const dates = new Set();
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      dates.add(date);
    });

    const sortedDates = Array.from(dates).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);

      if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  calculateXPGained(events) {
    return events.reduce((total, event) => {
      return total + (event.eventData?.xpGained || 0);
    }, 0);
  }

  calculateImprovementRate(events) {
    if (events.length < 2) return 0;

    const scores = events.filter(e => e.eventData?.score !== undefined).map(e => e.eventData.score);

    if (scores.length < 2) return 0;

    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    return ((avgSecond - avgFirst) / avgFirst) * 100;
  }

  calculateAverageTimePerLesson(events) {
    const timings = events.filter(e => e.eventData?.timeSpent).map(e => e.eventData.timeSpent);

    if (timings.length === 0) return 0;

    return timings.reduce((a, b) => a + b, 0) / timings.length;
  }

  getTopicPerformance(events) {
    const topicMap = {};

    events.forEach(event => {
      const topic = event.eventData?.topic || 'general';
      if (!topicMap[topic]) {
        topicMap[topic] = { scores: [], count: 0 };
      }
      if (event.eventData?.score !== undefined) {
        topicMap[topic].scores.push(event.eventData.score);
      }
      topicMap[topic].count++;
    });

    return Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      averageScore: data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
      attempts: data.count
    }));
  }

  async readAnalytics() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { events: [], stats: {} };
      }
      throw error;
    }
  }

  async writeAnalytics(analytics) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    } catch (error) {
      console.error('Error writing analytics:', error);
      throw error;
    }
  }
}

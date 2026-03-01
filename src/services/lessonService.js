import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const LESSONS_FILE = path.join(DATA_DIR, 'lessons.json');

export default class LessonService {
  async getLessonsByCourse(courseId) {
    try {
      const lessons = await this.readLessons();
      return lessons.filter(l => l.courseId === courseId);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  }

  async getLessonById(lessonId) {
    try {
      const lessons = await this.readLessons();
      return lessons.find(l => l.id === lessonId) || null;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
  }

  async createLesson(lessonData) {
    try {
      const lessons = await this.readLessons();
      lessons.push(lessonData);
      await this.writeLessons(lessons);
      return lessonData;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  async updateLesson(lessonId, updates) {
    try {
      const lessons = await this.readLessons();
      const index = lessons.findIndex(l => l.id === lessonId);

      if (index === -1) return null;

      lessons[index] = { ...lessons[index], ...updates };
      await this.writeLessons(lessons);
      return lessons[index];
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  async deleteLesson(lessonId) {
    try {
      const lessons = await this.readLessons();
      const index = lessons.findIndex(l => l.id === lessonId);

      if (index === -1) return false;

      lessons.splice(index, 1);
      await this.writeLessons(lessons);
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }

  async completeLesson(lessonId, completionData) {
    try {
      const lesson = await this.getLessonById(lessonId);
      if (!lesson) return null;

      const updatedLesson = {
        ...lesson,
        completed: true,
        completionData,
        stats: {
          ...lesson.stats,
          attempts: (lesson.stats.attempts || 0) + 1,
          averageScore: completionData.score,
          completionRate: 100
        }
      };

      return await this.updateLesson(lessonId, updatedLesson);
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  }

  async readLessons() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const data = await fs.readFile(LESSONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeLessons(lessons) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(LESSONS_FILE, JSON.stringify(lessons, null, 2));
    } catch (error) {
      console.error('Error writing lessons:', error);
      throw error;
    }
  }
}

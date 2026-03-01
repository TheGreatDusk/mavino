import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { deepClone } from '../utils/helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');

export default class CourseService {
  async getAllCourses(options = {}) {
    try {
      const courses = await this.readCourses();
      const { filter, sort, limit, offset } = options;

      let filtered = courses;

      if (filter) {
        filtered = courses.filter(c =>
          c.title.toLowerCase().includes(filter.toLowerCase()) ||
          c.description.toLowerCase().includes(filter.toLowerCase()) ||
          c.category === filter
        );
      }

      if (sort) {
        filtered.sort((a, b) => {
          if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
          if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
          if (sort === 'title') return a.title.localeCompare(b.title);
          return 0;
        });
      }

      if (limit) {
        return filtered.slice(offset || 0, (offset || 0) + limit);
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourseById(courseId) {
    try {
      const courses = await this.readCourses();
      return courses.find(c => c.id === courseId) || null;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async createCourse(courseData) {
    try {
      const courses = await this.readCourses();
      const newCourse = {
        ...courseData,
        units: [],
        stats: {
          lessonsCount: 0,
          studentsEnrolled: 0,
          averageRating: 0
        }
      };

      courses.push(newCourse);
      await this.writeCourses(courses);
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(courseId, updates) {
    try {
      const courses = await this.readCourses();
      const index = courses.findIndex(c => c.id === courseId);

      if (index === -1) return null;

      courses[index] = { ...courses[index], ...updates };
      await this.writeCourses(courses);
      return courses[index];
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      const courses = await this.readCourses();
      const index = courses.findIndex(c => c.id === courseId);

      if (index === -1) return false;

      courses.splice(index, 1);
      await this.writeCourses(courses);
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  async getCourseProgress(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) return null;

      const totalUnits = course.units ? course.units.length : 0;
      const completedUnits = course.units ? course.units.filter(u => u.status === 'completed').length : 0;

      return {
        courseId,
        title: course.title,
        progress: totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0,
        completedUnits,
        totalUnits,
        stats: course.stats
      };
    } catch (error) {
      console.error('Error fetching course progress:', error);
      return null;
    }
  }

  async duplicateCourse(courseId) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) return null;

      const duplicatedCourse = {
        ...deepClone(course),
        id: uuidv4(),
        title: `${course.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await this.createCourse(duplicatedCourse);
    } catch (error) {
      console.error('Error duplicating course:', error);
      throw error;
    }
  }

  async readCourses() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const data = await fs.readFile(COURSES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeCourses(courses) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(COURSES_FILE, JSON.stringify(courses, null, 2));
    } catch (error) {
      console.error('Error writing courses:', error);
      throw error;
    }
  }
}

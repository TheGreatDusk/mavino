import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const USER_FILE = path.join(DATA_DIR, 'user-profile.json');

export default class UserService {
  async getUserProfile() {
    try {
      let profile = await this.readProfile();

      if (!profile) {
        profile = {
          id: uuidv4(),
          username: 'learner',
          email: '',
          bio: '',
          level: 1,
          xp: 0,
          streak: 0,
          createdAt: new Date().toISOString(),
          preferences: {
            theme: 'light',
            notifications: true,
            soundEffects: true
          }
        };
        await this.writeProfile(profile);
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(updates) {
    try {
      let profile = await this.getUserProfile();
      profile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.writeProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const profile = await this.getUserProfile();
      const statsFile = path.join(DATA_DIR, 'user-stats.json');

      let stats;
      try {
        const data = await fs.readFile(statsFile, 'utf-8');
        stats = JSON.parse(data);
      } catch {
        stats = {
          totalLessonsCompleted: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          lessonsThisWeek: 0,
          currentStreak: profile.streak || 0,
          bestStreak: 0,
          level: profile.level || 1,
          xp: profile.xp || 0
        };
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(statsFile, JSON.stringify(stats, null, 2));
      }

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  async getAchievements() {
    try {
      const achievementsFile = path.join(DATA_DIR, 'achievements.json');

      let achievements;
      try {
        const data = await fs.readFile(achievementsFile, 'utf-8');
        achievements = JSON.parse(data);
      } catch {
        achievements = [
          {
            id: 'first-lesson',
            title: 'First Step',
            description: 'Complete your first lesson',
            icon: '🎵',
            unlocked: false
          },
          {
            id: 'week-streak',
            title: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🔥',
            unlocked: false
          },
          {
            id: 'perfect-score',
            title: 'Perfect Performance',
            description: 'Get a perfect score on 5 lessons',
            icon: '⭐',
            unlocked: false
          }
        ];
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(achievementsFile, JSON.stringify(achievements, null, 2));
      }

      return achievements;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  async exportData() {
    try {
      const profile = await this.getUserProfile();
      const stats = await this.getUserStats();
      const achievements = await this.getAchievements();

      const lessonsFile = path.join(DATA_DIR, 'lessons.json');
      const coursesFile = path.join(DATA_DIR, 'courses.json');

      let lessons = [];
      let courses = [];

      try {
        lessons = JSON.parse(await fs.readFile(lessonsFile, 'utf-8'));
      } catch {
        lessons = [];
      }

      try {
        courses = JSON.parse(await fs.readFile(coursesFile, 'utf-8'));
      } catch {
        courses = [];
      }

      return {
        exportDate: new Date().toISOString(),
        profile,
        stats,
        achievements,
        courses,
        lessons
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  async importData(data) {
    try {
      if (data.profile) {
        await this.writeProfile(data.profile);
      }

      if (data.courses && Array.isArray(data.courses)) {
        const coursesFile = path.join(DATA_DIR, 'courses.json');
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(coursesFile, JSON.stringify(data.courses, null, 2));
      }

      if (data.lessons && Array.isArray(data.lessons)) {
        const lessonsFile = path.join(DATA_DIR, 'lessons.json');
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(lessonsFile, JSON.stringify(data.lessons, null, 2));
      }

      return {
        message: 'Data imported successfully',
        itemsImported: {
          profile: !!data.profile,
          courses: data.courses?.length || 0,
          lessons: data.lessons?.length || 0
        }
      };
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  }

  async readProfile() {
    try {
      const data = await fs.readFile(USER_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async writeProfile(profile) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(USER_FILE, JSON.stringify(profile, null, 2));
    } catch (error) {
      console.error('Error writing user profile:', error);
      throw error;
    }
  }
}

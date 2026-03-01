import UserService from '../services/userService.js';
import { AppError } from '../utils/errors.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUserProfile(req, res) {
    try {
      const profile = await this.userService.getUserProfile();

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      throw new AppError('Failed to fetch user profile', 500, error);
    }
  }

  async updateUserProfile(req, res) {
    try {
      const updates = req.body;
      const allowedFields = ['username', 'email', 'preferences', 'bio'];
      const filteredUpdates = {};

      allowedFields.forEach(field => {
        if (field in updates) {
          filteredUpdates[field] = updates[field];
        }
      });

      const updatedProfile = await this.userService.updateUserProfile(filteredUpdates);

      res.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      throw new AppError('Failed to update user profile', 500, error);
    }
  }

  async getUserStats(req, res) {
    try {
      const stats = await this.userService.getUserStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      throw new AppError('Failed to fetch user stats', 500, error);
    }
  }

  async getAchievements(req, res) {
    try {
      const achievements = await this.userService.getAchievements();

      res.json({
        success: true,
        data: achievements
      });
    } catch (error) {
      throw new AppError('Failed to fetch achievements', 500, error);
    }
  }

  async exportUserData(req, res) {
    try {
      const data = await this.userService.exportData();

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=music-master-data.json');
      res.send(JSON.stringify(data, null, 2));
    } catch (error) {
      throw new AppError('Failed to export user data', 500, error);
    }
  }

  async importUserData(req, res) {
    try {
      const { data } = req.body;

      if (!data) throw new AppError('Data is required for import', 400);

      const result = await this.userService.importData(data);

      res.json({
        success: true,
        message: 'User data imported successfully',
        data: result
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to import user data', 500, error);
    }
  }
}

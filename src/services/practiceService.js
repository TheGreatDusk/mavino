import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const PRACTICE_FILE = path.join(DATA_DIR, 'practice-sessions.json');

export default class PracticeService {
  async getPracticeByMode(mode) {
    try {
      const sessions = await this.readSessions();
      return sessions.filter(s => s.mode === mode).slice(0, 20);
    } catch (error) {
      console.error('Error fetching practice by mode:', error);
      return [];
    }
  }

  async createSession(sessionData) {
    try {
      const sessions = await this.readSessions();
      sessions.push(sessionData);
      await this.writeSessions(sessions);
      return sessionData;
    } catch (error) {
      console.error('Error creating practice session:', error);
      throw error;
    }
  }

  async completeSession(sessionId, completionData) {
    try {
      const sessions = await this.readSessions();
      const index = sessions.findIndex(s => s.id === sessionId);

      if (index === -1) return null;

      sessions[index] = {
        ...sessions[index],
        ...completionData,
        duration: new Date(completionData.completedAt) - new Date(sessions[index].startedAt)
      };

      await this.writeSessions(sessions);
      return sessions[index];
    } catch (error) {
      console.error('Error completing practice session:', error);
      throw error;
    }
  }

  async getHistory(options = {}) {
    try {
      const sessions = await this.readSessions();
      const { limit = 50, offset = 0 } = options;

      const sorted = sessions.sort((a, b) =>
        new Date(b.startedAt) - new Date(a.startedAt)
      );

      return sorted.slice(offset, offset + limit);
    } catch (error) {
      console.error('Error fetching practice history:', error);
      return [];
    }
  }

  async readSessions() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const data = await fs.readFile(PRACTICE_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeSessions(sessions) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(PRACTICE_FILE, JSON.stringify(sessions, null, 2));
    } catch (error) {
      console.error('Error writing practice sessions:', error);
      throw error;
    }
  }
}

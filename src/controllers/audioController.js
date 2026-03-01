import AudioService from '../services/audioService.js';
import { AppError } from '../utils/errors.js';

export class AudioController {
  constructor() {
    this.audioService = new AudioService();
  }

  async generateAudio(req, res) {
    try {
      const { notes, tempo, scale, instrument } = req.body;

      if (!notes || !Array.isArray(notes) || notes.length === 0) {
        throw new AppError('Notes array is required and must not be empty', 400);
      }

      if (tempo && (tempo < 40 || tempo > 300)) {
        throw new AppError('Tempo must be between 40 and 300 BPM', 400);
      }

      const audioData = await this.audioService.generateAudio({
        notes,
        tempo: tempo || 120,
        scale: scale || 'C major',
        instrument: instrument || 'piano'
      });

      res.json({
        success: true,
        data: audioData,
        message: 'Audio generated successfully'
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to generate audio', 500, error);
    }
  }

  async analyzeAudio(req, res) {
    try {
      const { audioBase64, threshold } = req.body;

      if (!audioBase64) throw new AppError('Audio data is required', 400);

      const analysis = await this.audioService.analyzeAudio({
        audioBase64,
        threshold: threshold || 0.5
      });

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to analyze audio', 500, error);
    }
  }

  async getNoteFrequencies(req, res) {
    try {
      const frequencies = this.audioService.getNoteFrequencies();

      res.json({
        success: true,
        data: frequencies
      });
    } catch (error) {
      throw new AppError('Failed to fetch note frequencies', 500, error);
    }
  }
}

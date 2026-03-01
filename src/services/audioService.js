import { AppError } from '../utils/errors.js';

export default class AudioService {
  constructor() {
    this.noteFrequencies = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
      'F': 349.23, 'F#': 369.99, 'G': 391.99, 'G#': 415.30, 'A': 440.00,
      'A#': 466.16, 'B': 493.88
    };

    this.scales = {
      'C major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'A minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      'G major': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
      'E minor': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
      'D major': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']
    };

    this.instruments = {
      'piano': { type: 'sine', decay: 0.5 },
      'guitar': { type: 'triangle', decay: 0.3 },
      'violin': { type: 'sawtooth', decay: 0.8 },
      'flute': { type: 'sine', decay: 0.4 }
    };
  }

  async generateAudio(options) {
    try {
      const { notes, tempo, scale, instrument } = options;

      if (!notes || notes.length === 0) {
        throw new AppError('Notes array cannot be empty', 400);
      }

      const scaleNotes = this.scales[scale] || this.scales['C major'];
      const instrumentConfig = this.instruments[instrument] || this.instruments['piano'];
      const beatDuration = (60 / tempo) * 1000;

      const audioData = {
        id: this.generateId(),
        notes,
        tempo,
        scale,
        instrument,
        beatDuration,
        totalDuration: notes.length * beatDuration,
        sequence: this.generateSequence(notes, scaleNotes, instrumentConfig),
        timestamp: new Date().toISOString()
      };

      return audioData;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to generate audio', 500, error);
    }
  }

  generateSequence(notes, scaleNotes, instrumentConfig) {
    return notes.map((note, index) => ({
      index,
      note: note.name || note,
      octave: note.octave || 4,
      duration: note.duration || 1,
      frequency: this.getFrequency(note.name || note, note.octave || 4),
      type: instrumentConfig.type,
      decay: instrumentConfig.decay,
      timestamp: index
    }));
  }

  getFrequency(noteName, octave) {
    const baseFreq = this.noteFrequencies[noteName];
    if (!baseFreq) {
      throw new AppError(`Unknown note: ${noteName}`, 400);
    }
    return baseFreq * Math.pow(2, octave - 4);
  }

  async analyzeAudio(options) {
    try {
      const { audioBase64, threshold } = options;

      if (!audioBase64) {
        throw new AppError('Audio data is required', 400);
      }

      const analysis = {
        duration: Math.random() * 10,
        averageFrequency: 440 + (Math.random() * 100 - 50),
        dominantNotes: this.generateDominantNotes(threshold),
        spectrum: this.generateSpectrum(),
        quality: this.calculateQuality(threshold),
        timestamp: new Date().toISOString()
      };

      return analysis;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to analyze audio', 500, error);
    }
  }

  generateDominantNotes(threshold) {
    const noteNames = Object.keys(this.noteFrequencies);
    const count = Math.ceil(5 * threshold);
    return noteNames.sort(() => Math.random() - 0.5).slice(0, count);
  }

  generateSpectrum() {
    const spectrum = [];
    for (let i = 0; i < 128; i++) {
      spectrum.push({
        frequency: 20 * Math.pow(2, i / 12),
        magnitude: Math.random() * 100
      });
    }
    return spectrum;
  }

  calculateQuality(threshold) {
    const score = threshold * 100;
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  getNoteFrequencies() {
    return this.noteFrequencies;
  }

  generateId() {
    return 'audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

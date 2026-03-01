import express from 'express';
import { AudioController } from '../controllers/audioController.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
const audioController = new AudioController();

router.post('/generate', asyncHandler((req, res) => audioController.generateAudio(req, res)));
router.post('/analyze', asyncHandler((req, res) => audioController.analyzeAudio(req, res)));
router.get('/notes', asyncHandler((req, res) => audioController.getNoteFrequencies(req, res)));

export default router;

import { Router } from 'express';
import { fetchLatestFromThingSpeak } from '../services/thingspeak.js';
import { generateSuggestion } from '../services/suggestions.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchLatestFromThingSpeak();
    const suggestion = generateSuggestion(data);
    res.json({ suggestion, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

export default router;




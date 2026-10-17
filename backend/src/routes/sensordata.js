import { Router } from 'express';
import { fetchLatestFromThingSpeak } from '../services/thingspeak.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchLatestFromThingSpeak();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

export default router;




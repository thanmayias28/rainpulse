import { Router } from 'express';
import { fetchCurrentWeather, generateIrrigationAdviceFromWeather } from '../services/weather.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    const latNum = lat != null ? Number(lat) : undefined;
    const lonNum = lon != null ? Number(lon) : undefined;
    const weather = await fetchCurrentWeather({ lat: latNum, lon: lonNum, city });
    const advice = generateIrrigationAdviceFromWeather(weather);
    res.json({ weather, advice });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather', details: error.message });
  }
});

export default router;




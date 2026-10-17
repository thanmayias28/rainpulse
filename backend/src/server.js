import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sensordataRouter from './routes/sensordata.js';
import suggestionRouter from './routes/suggestion.js';
import weatherRouter from './routes/weather.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'rainpulse-backend' });
});

app.use('/api/sensordata', sensordataRouter);
app.use('/api/suggestion', suggestionRouter);
app.use('/api/weather', weatherRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`RainPulse backend listening on port ${PORT}`);
});



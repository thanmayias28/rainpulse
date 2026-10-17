import axios from 'axios';

const openWeatherApiKey = process.env.WEATHER_API_KEY;

export async function fetchCurrentWeather({ lat, lon, city }) {
  if (!openWeatherApiKey) {
    throw new Error('WEATHER_API_KEY not set');
  }

  const base = 'https://api.openweathermap.org/data/2.5/weather';
  const params = new URLSearchParams();
  if (lat != null && lon != null) {
    params.set('lat', String(lat));
    params.set('lon', String(lon));
  } else if (city) {
    params.set('q', city);
  } else {
    throw new Error('Provide lat/lon or city');
  }
  params.set('appid', openWeatherApiKey);
  params.set('units', 'metric');

  const url = `${base}?${params.toString()}`;
  const { data } = await axios.get(url, { timeout: 10000 });
  return normalizeWeather(data);
}

export function generateIrrigationAdviceFromWeather(weather) {
  const main = weather?.main || '';
  const rain1h = weather?.rainLast1hMm ?? 0;
  const humidity = weather?.humidity ?? 0;
  const temp = weather?.temperatureC ?? 0;

  if (main.includes('Rain') || rain1h > 0) {
    if (rain1h < 2) {
      return 'Light rain expected/detected. Reduce irrigation; monitor soil moisture.';
    }
    return 'Rainy conditions. Delay irrigation to avoid waterlogging.';
  }
  if (humidity < 40 && temp > 32) {
    return 'Hot and dry conditions. Consider moderate irrigation during early morning/evening.';
  }
  if (humidity > 85 && temp >= 20 && temp <= 28) {
    return 'Humid conditions. Watch for fungal diseases; avoid late evening irrigation.';
  }
  return 'Normal weather. Irrigate based on soil moisture readings and crop stage.';
}

function normalizeWeather(raw) {
  const weatherMain = raw.weather?.[0]?.main || '';
  const weatherDesc = raw.weather?.[0]?.description || '';
  const temperatureC = raw.main?.temp ?? null;
  const humidity = raw.main?.humidity ?? null;
  const windSpeedMs = raw.wind?.speed ?? null;
  const rainLast1hMm = raw.rain?.['1h'] ?? 0;
  const city = raw.name || null;

  return {
    city,
    main: `${weatherMain} (${weatherDesc})`.trim(),
    temperatureC,
    humidity,
    windSpeedMs,
    rainLast1hMm,
  };
}



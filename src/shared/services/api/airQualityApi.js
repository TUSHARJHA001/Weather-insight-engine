import axios from 'axios';
import { cacheGet, cacheSet } from '../cache.js';
import { CACHE_KEYS, AQI_LEVELS } from '../../constants/index.js';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '0a9c043d5f1b56f2e377adbc998bbec3';
const BASE = 'https://api.openweathermap.org/data/2.5';

const client = axios.create({ baseURL: BASE, timeout: 10000 });

export async function fetchAirQuality(lat, lon) {
  const key = CACHE_KEYS.AIR_QUALITY + `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = await cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get('/air_pollution', {
    params: { lat, lon, appid: API_KEY }
  });

  const normalized = normalizeAirQuality(data);
  await cacheSet(key, normalized, 10 * 60 * 1000); // 10 min cache
  return normalized;
}

function normalizeAirQuality(raw) {
  const item = raw.list?.[0];
  if (!item) return null;

  const aqi = item.main.aqi; // 1-5 scale from OpenWeather
  // Map OW 1-5 to AQI 0-300
  const aqiValues = [25, 75, 125, 175, 250];
  const aqiScore = aqiValues[aqi - 1] || 25;

  const level = AQI_LEVELS.find((l) => aqiScore <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];

  return {
    aqi: aqiScore,
    aqiRaw: aqi,
    classification: level.label,
    color: level.color,
    bg: level.bg,
    pm25: item.components?.pm2_5?.toFixed(1) || '—',
    pm10: item.components?.pm10?.toFixed(1) || '—',
    co: item.components?.co?.toFixed(1) || '—',
    no2: item.components?.no2?.toFixed(1) || '—',
    o3: item.components?.o3?.toFixed(1) || '—',
    so2: item.components?.so2?.toFixed(1) || '—',
    nh3: item.components?.nh3?.toFixed(1) || '—',
  };
}

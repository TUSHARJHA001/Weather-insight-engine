import axios from 'axios';
import { cacheGet, cacheSet } from '../cache.js';
import { CACHE_KEYS } from '../../constants/index.js';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '0a9c043d5f1b56f2e377adbc998bbec3';
const BASE = 'https://api.openweathermap.org/data/2.5';

const client = axios.create({ baseURL: BASE, timeout: 10000 });

export async function fetchForecastByCity(city) {
  const key = CACHE_KEYS.FORECAST + city.toLowerCase();
  const cached = await cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get('/forecast', {
    params: { q: city, appid: API_KEY, units: 'metric', cnt: 40 }
  });

  const normalized = normalizeForecast(data);
  await cacheSet(key, normalized);
  return normalized;
}

export async function fetchForecastByCoords(lat, lon) {
  const key = CACHE_KEYS.FORECAST + `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = await cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get('/forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 }
  });

  const normalized = normalizeForecast(data);
  await cacheSet(key, normalized);
  return normalized;
}

function normalizeForecast(raw) {
  const hourly = raw.list.map((item) => ({
    timestamp: item.dt,
    temp: item.main.temp,
    feelsLike: item.main.feels_like,
    humidity: item.main.humidity,
    pressure: item.main.pressure,
    windSpeed: item.wind?.speed || 0,
    cloudCover: item.clouds?.all || 0,
    visibility: item.visibility || 10000,
    rainProbability: Math.round((item.pop || 0) * 100),
    rain: item.rain?.['3h'] || 0,
    condition: item.weather[0]?.main || 'Clear',
    description: item.weather[0]?.description || '',
    icon: item.weather[0]?.icon || '01d',
    conditionId: item.weather[0]?.id || 800,
  }));

  // Group into daily
  const dailyMap = {};
  hourly.forEach((h) => {
    const date = new Date(h.timestamp * 1000).toDateString();
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(h);
  });

  const daily = Object.entries(dailyMap).map(([date, items]) => {
    const temps = items.map((i) => i.temp);
    const noons = items.filter((i) => {
      const hour = new Date(i.timestamp * 1000).getHours();
      return hour >= 11 && hour <= 14;
    });
    const rep = noons[0] || items[Math.floor(items.length / 2)];
    return {
      date,
      timestamp: rep.timestamp,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      humidity: Math.round(items.reduce((s, i) => s + i.humidity, 0) / items.length),
      rainProbability: Math.max(...items.map((i) => i.rainProbability)),
      windSpeed: Math.round(items.reduce((s, i) => s + i.windSpeed, 0) / items.length * 10) / 10,
      condition: rep.condition,
      description: rep.description,
      icon: rep.icon,
      conditionId: rep.conditionId,
    };
  });

  return { hourly, daily, city: raw.city };
}

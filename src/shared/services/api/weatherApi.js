import axios from 'axios';
import { cacheGet, cacheSet } from '../cache.js';
import { CACHE_KEYS } from '../../constants/index.js';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '0a9c043d5f1b56f2e377adbc998bbec3';
const BASE = 'https://api.openweathermap.org/data/2.5';

const client = axios.create({ baseURL: BASE, timeout: 10000 });

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Network error';
    throw new Error(msg);
  }
);

export async function fetchWeatherByCity(city) {
  const key = CACHE_KEYS.CURRENT_WEATHER + city.toLowerCase();
  const cached = await cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get('/weather', {
    params: { q: city, appid: API_KEY, units: 'metric' }
  });

  const normalized = normalizeCurrentWeather(data);
  await cacheSet(key, normalized);
  return normalized;
}

export async function fetchWeatherByCoords(lat, lon) {
  const key = CACHE_KEYS.CURRENT_WEATHER + `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = await cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get('/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric' }
  });

  const normalized = normalizeCurrentWeather(data);
  await cacheSet(key, normalized);
  return normalized;
}

function normalizeCurrentWeather(raw) {
  return {
    id: raw.id,
    city: raw.name,
    country: raw.sys?.country || '',
    temperature: raw.main.temp,
    feelsLike: raw.main.feels_like,
    tempMin: raw.main.temp_min,
    tempMax: raw.main.temp_max,
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    visibility: raw.visibility || 10000,
    windSpeed: raw.wind?.speed || 0,
    windDeg: raw.wind?.deg || 0,
    cloudCover: raw.clouds?.all || 0,
    condition: raw.weather[0]?.main || 'Clear',
    description: raw.weather[0]?.description || '',
    icon: raw.weather[0]?.icon || '01d',
    conditionId: raw.weather[0]?.id || 800,
    sunrise: raw.sys?.sunrise,
    sunset: raw.sys?.sunset,
    timezone: raw.timezone || 0,
    lat: raw.coord?.lat,
    lon: raw.coord?.lon,
    timestamp: raw.dt,
    fetchedAt: Date.now(),
  };
}

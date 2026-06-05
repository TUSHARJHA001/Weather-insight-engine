import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '0a9c043d5f1b56f2e377adbc998bbec3';
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

const client = axios.create({ baseURL: GEO_BASE, timeout: 8000 });

export async function geocodeCity(city, limit = 5) {
  const { data } = await client.get('/direct', {
    params: { q: city, limit, appid: API_KEY }
  });
  return data.map((r) => ({
    name: r.name,
    country: r.country,
    state: r.state,
    lat: r.lat,
    lon: r.lon,
    displayName: [r.name, r.state, r.country].filter(Boolean).join(', ')
  }));
}

export async function reverseGeocode(lat, lon) {
  const { data } = await client.get('/reverse', {
    params: { lat, lon, limit: 1, appid: API_KEY }
  });
  if (!data.length) return null;
  const r = data[0];
  return {
    name: r.name,
    country: r.country,
    state: r.state,
    lat: r.lat,
    lon: r.lon,
    displayName: [r.name, r.state, r.country].filter(Boolean).join(', ')
  };
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(new Error(err.message)),
      { timeout: 10000, maximumAge: 60000 }
    );
  });
}

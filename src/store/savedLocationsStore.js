import { create } from "zustand";
import { CACHE_KEYS } from "@/shared/constants/index.js";
import { fetchWeatherByCity } from "@/shared/services/api/weatherApi.js";
import { fetchAirQuality } from "@/shared/services/api/airQualityApi.js";

const KEY = CACHE_KEYS.SAVED_LOCATIONS;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function save(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export const useSavedLocationsStore = create((set, get) => ({
  locations: load(),
  weatherCache: {},

  addLocation: (city) => {
    const current = get().locations;
    if (current.find((l) => l.city.toLowerCase() === city.toLowerCase()))
      return;
    const updated = [...current, { city, pinned: false, addedAt: Date.now() }];
    save(updated);
    set({ locations: updated });
    get().refreshLocation(city);
  },

  removeLocation: (city) => {
    const updated = get().locations.filter(
      (l) => l.city.toLowerCase() !== city.toLowerCase(),
    );
    save(updated);
    set({ locations: updated });
  },

  togglePin: (city) => {
    const updated = get().locations.map((l) =>
      l.city.toLowerCase() === city.toLowerCase()
        ? { ...l, pinned: !l.pinned }
        : l,
    );
    save(updated);
    set({ locations: updated });
  },

  reorderLocations: (newOrder) => {
    save(newOrder);
    set({ locations: newOrder });
  },

  refreshLocation: async (city) => {
    try {
      const weather = await fetchWeatherByCity(city);
      const aqi = await fetchAirQuality(weather.lat, weather.lon).catch(
        () => null,
      );
      set((s) => ({
        weatherCache: {
          ...s.weatherCache,
          [city.toLowerCase()]: { weather, aqi, updatedAt: Date.now() },
        },
      }));
    } catch {}
  },

  refreshAll: () => {
    get().locations.forEach((l) => get().refreshLocation(l.city));
  },

  getWeatherForCity: (city) => get().weatherCache[city.toLowerCase()] || null,
}));

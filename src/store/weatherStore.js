import { create } from "zustand";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from "@/shared/services/api/weatherApi.js";
import {
  fetchForecastByCity,
  fetchForecastByCoords,
} from "@/shared/services/api/forecastApi.js";
import { fetchAirQuality } from "@/shared/services/api/airQualityApi.js";
import { computeWeatherScore } from "@/engines/weatherScoreEngine.js";
import { computeSeverity } from "@/engines/severityEngine.js";
import { generateAlerts } from "@/engines/alertEngine.js";
import { generateInsights } from "@/engines/insightEngine.js";
import { CACHE_KEYS } from "@/shared/constants/index.js";

const RECENT_KEY = CACHE_KEYS.RECENT_SEARCHES;

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveRecentSearches(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}

export const useWeatherStore = create((set, get) => ({
  current: null,
  forecast: null,
  airQuality: null,
  score: null,
  severity: null,
  alerts: [],
  insights: [],
  loading: false,
  error: null,
  activeCity: null,
  recentSearches: getRecentSearches(),

  _computeDerived: (current, airQuality, forecast) => {
    const score = computeWeatherScore(current, airQuality);
    const severity = computeSeverity(current, airQuality);
    const alerts = generateAlerts(current, airQuality, forecast);
    const insights = generateInsights(current, forecast, airQuality);
    return { score, severity, alerts, insights };
  },

  fetchByCity: async (city) => {
    set({ loading: true, error: null });
    try {
      const [current, forecast] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      const airQuality = await fetchAirQuality(current.lat, current.lon).catch(
        () => null,
      );
      const derived = get()._computeDerived(current, airQuality, forecast);

      // Update recent searches
      const recent = [
        city,
        ...getRecentSearches().filter(
          (c) => c.toLowerCase() !== city.toLowerCase(),
        ),
      ].slice(0, 10);
      saveRecentSearches(recent);

      set({
        current,
        forecast,
        airQuality,
        ...derived,
        loading: false,
        activeCity: city,
        recentSearches: recent,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchByCoords: async (lat, lon) => {
    set({ loading: true, error: null });
    try {
      const [current, forecast] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ]);
      const airQuality = await fetchAirQuality(lat, lon).catch(() => null);
      const derived = get()._computeDerived(current, airQuality, forecast);

      set({
        current,
        forecast,
        airQuality,
        ...derived,
        loading: false,
        activeCity: current.city,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  clearRecentSearches: () => {
    saveRecentSearches([]);
    set({ recentSearches: [] });
  },
}));

// Selectors
export const selectCurrent = (s) => s.current;
export const selectForecast = (s) => s.forecast;
export const selectAirQuality = (s) => s.airQuality;
export const selectScore = (s) => s.score;
export const selectSeverity = (s) => s.severity;
export const selectAlerts = (s) => s.alerts;
export const selectInsights = (s) => s.insights;
export const selectLoading = (s) => s.loading;
export const selectError = (s) => s.error;
export const selectRecentSearches = (s) => s.recentSearches;
export const selectActiveCity = (s) => s.activeCity;

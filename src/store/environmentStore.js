import { create } from "zustand";
import { CONDITION_MAP } from "@/shared/constants/index.js";

function getThemeFromConditionId(conditionId, isNight) {
  if (isNight) return "night";
  return CONDITION_MAP[conditionId] || "clear";
}

export const useEnvironmentStore = create((set) => ({
  theme: "clear",
  conditionId: 800,
  isNight: false,

  updateFromWeather: (weather) => {
    if (!weather) return;
    const now = Date.now() / 1000;
    const isNight = now < weather.sunrise || now > weather.sunset;
    const theme = getThemeFromConditionId(weather.conditionId, isNight);
    // Update DOM
    document.documentElement.dataset.theme = theme;
    set({ theme, conditionId: weather.conditionId, isNight });
  },
}));

export const selectTheme = (s) => s.theme;

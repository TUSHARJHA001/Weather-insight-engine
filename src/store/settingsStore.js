import { create } from "zustand";
import { CACHE_KEYS } from "@/shared/constants/index.js";

const KEY = CACHE_KEYS.SETTINGS;
const defaults = { unit: "C", reducedMotion: false, defaultCity: "London" };

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return defaults;
  }
}
function save(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export const useSettingsStore = create((set, get) => ({
  ...load(),
  set: (key, value) => {
    const updated = { ...get(), [key]: value };
    save(updated);
    set({ [key]: value });
  },
}));

export const selectUnit = (s) => s.unit;

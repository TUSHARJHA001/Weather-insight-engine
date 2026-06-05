export const API_BASE = "https://api.openweathermap.org";

export const WEATHER_THEMES = {
  clear: "clear",
  cloudy: "cloudy",
  rain: "rain",
  thunderstorm: "thunderstorm",
  snow: "snow",
  fog: "fog",
  night: "night",
};

export const CONDITION_MAP = {
  // thunderstorm
  200: "thunderstorm",
  201: "thunderstorm",
  202: "thunderstorm",
  210: "thunderstorm",
  211: "thunderstorm",
  212: "thunderstorm",
  221: "thunderstorm",
  230: "thunderstorm",
  231: "thunderstorm",
  232: "thunderstorm",
  // drizzle
  300: "rain",
  301: "rain",
  302: "rain",
  310: "rain",
  311: "rain",
  312: "rain",
  313: "rain",
  314: "rain",
  321: "rain",
  // rain
  500: "rain",
  501: "rain",
  502: "rain",
  503: "rain",
  504: "rain",
  511: "snow",
  520: "rain",
  521: "rain",
  522: "rain",
  531: "rain",
  // snow
  600: "snow",
  601: "snow",
  602: "snow",
  611: "snow",
  612: "snow",
  613: "snow",
  615: "snow",
  616: "snow",
  620: "snow",
  621: "snow",
  622: "snow",
  // atmosphere
  701: "fog",
  711: "fog",
  721: "fog",
  731: "fog",
  741: "fog",
  751: "fog",
  761: "fog",
  762: "fog",
  771: "fog",
  781: "thunderstorm",
  // clear
  800: "clear",
  // clouds
  801: "cloudy",
  802: "cloudy",
  803: "cloudy",
  804: "cloudy",
};

export const AQI_LEVELS = [
  { max: 50, label: "Good", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { max: 100, label: "Fair", color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  {
    max: 150,
    label: "Moderate",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  { max: 200, label: "Poor", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  {
    max: 300,
    label: "Very Poor",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  {
    max: Infinity,
    label: "Hazardous",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.12)",
  },
];

export const SEVERITY_LEVELS = [
  { level: 1, title: "Excellent", color: "#10b981" },
  { level: 2, title: "Good", color: "#22d3ee" },
  { level: 3, title: "Moderate", color: "#f59e0b" },
  { level: 4, title: "Uncomfortable", color: "#f97316" },
  { level: 5, title: "Risky", color: "#ef4444" },
  { level: 6, title: "Severe", color: "#dc2626" },
  { level: 7, title: "Extreme", color: "#7c3aed" },
];

export const CACHE_KEYS = {
  CURRENT_WEATHER: "wiq:current:",
  FORECAST: "wiq:forecast:",
  AIR_QUALITY: "wiq:aqi:",
  RECENT_SEARCHES: "wiq:recent_searches",
  SAVED_LOCATIONS: "wiq:saved_locations",
  SETTINGS: "wiq:settings",
};

export const DEFAULT_CITY = "London";

export const TIME_RANGES = [
  { label: "24H", hours: 24 },
  { label: "3D", hours: 72 },
  { label: "5D", hours: 120 },
  { label: "7D", hours: 168 },
];

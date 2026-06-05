const LEVELS = [
  {
    level: 1,
    title: "Excellent",
    color: "#10b981",
    description: "Ideal environmental conditions.",
  },
  {
    level: 2,
    title: "Good",
    color: "#22d3ee",
    description: "Comfortable conditions for outdoor activity.",
  },
  {
    level: 3,
    title: "Moderate",
    color: "#f59e0b",
    description: "Conditions are acceptable but some discomfort possible.",
  },
  {
    level: 4,
    title: "Uncomfortable",
    color: "#f97316",
    description: "Conditions may affect sensitive individuals.",
  },
  {
    level: 5,
    title: "Risky",
    color: "#ef4444",
    description: "Health risk for vulnerable groups. Limit outdoor exposure.",
  },
  {
    level: 6,
    title: "Severe",
    color: "#dc2626",
    description: "Significant health risk. Avoid prolonged outdoor activity.",
  },
  {
    level: 7,
    title: "Extreme",
    color: "#7c3aed",
    description: "Dangerous conditions. Stay indoors.",
  },
];

function tempSeverity(t) {
  if (t >= 16 && t <= 30) return 1;
  if ((t >= 10 && t < 16) || (t > 30 && t <= 34)) return 2;
  if ((t >= 5 && t < 10) || (t > 34 && t <= 38)) return 3;
  if ((t >= 0 && t < 5) || (t > 38 && t <= 42)) return 5;
  if ((t >= -5 && t < 0) || (t > 42 && t <= 46)) return 6;
  return 7;
}

function humiditySeverity(h) {
  if (h >= 35 && h <= 65) return 1;
  if ((h >= 25 && h < 35) || (h > 65 && h <= 75)) return 2;
  if ((h >= 15 && h < 25) || (h > 75 && h <= 85)) return 3;
  return 5;
}

function aqiSeverity(aqi) {
  if (aqi <= 50) return 1;
  if (aqi <= 100) return 2;
  if (aqi <= 150) return 3;
  if (aqi <= 200) return 4;
  if (aqi <= 300) return 6;
  return 7;
}

function uvSeverity(uv) {
  if (!uv) return 1;
  if (uv <= 2) return 1;
  if (uv <= 5) return 2;
  if (uv <= 7) return 3;
  if (uv <= 10) return 5;
  return 7;
}

function windSeverity(ms) {
  if (ms <= 5) return 1;
  if (ms <= 10) return 2;
  if (ms <= 17) return 3;
  if (ms <= 24) return 4;
  if (ms <= 32) return 5;
  return 7;
}

/**
 * @param {object} weather
 * @param {object|null} airQuality
 */
export function computeSeverity(weather, airQuality) {
  const scores = [
    tempSeverity(weather.temperature) * 2, // weight 2
    humiditySeverity(weather.humidity) * 1,
    aqiSeverity(airQuality?.aqi ?? 25) * 2,
    uvSeverity(weather.uvIndex) * 1,
    windSeverity(weather.windSpeed) * 1,
  ];

  const totalWeight = 7;
  const weighted = Math.round(scores.reduce((s, v) => s + v, 0) / totalWeight);
  const level = Math.min(7, Math.max(1, weighted));
  return LEVELS[level - 1];
}

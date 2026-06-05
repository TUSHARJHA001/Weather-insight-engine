import { AQI_LEVELS } from "@/shared/constants/index.js";

const HEALTH_IMPACTS = {
  Good: "Air quality is satisfactory. No health risk.",
  Fair: "Acceptable quality. Very sensitive individuals may experience minor discomfort.",
  Moderate:
    "Sensitive groups may experience effects. Limit prolonged outdoor exertion.",
  Poor: "Members of sensitive groups may experience health effects. General public less likely affected.",
  "Very Poor": "Health alert: everyone may experience health effects.",
  Hazardous: "Emergency conditions. Entire population at risk. Stay indoors.",
};

const RECOMMENDATIONS = {
  Good: "Ideal for outdoor activities.",
  Fair: "Outdoor activities generally fine.",
  Moderate: "Sensitive groups: consider reducing intense outdoor activity.",
  Poor: "Everyone: reduce prolonged outdoor exertion. Sensitive groups: avoid.",
  "Very Poor": "Avoid outdoor activities. Wear N95 if going outside.",
  Hazardous: "Stay indoors. Keep windows closed. Wear N95 mask if outside.",
};

/**
 * @param {number} aqiValue - 0-300+ AQI value
 * @returns {{ classification, color, bg, healthImpact, recommendation, level }}
 */
export function classifyAirQuality(aqiValue) {
  const level =
    AQI_LEVELS.find((l) => aqiValue <= l.max) ||
    AQI_LEVELS[AQI_LEVELS.length - 1];

  return {
    classification: level.label,
    color: level.color,
    bg: level.bg,
    healthImpact: HEALTH_IMPACTS[level.label],
    recommendation: RECOMMENDATIONS[level.label],
    level: AQI_LEVELS.indexOf(level) + 1,
  };
}

export function getAqiBarWidth(aqi) {
  return Math.min(100, (aqi / 300) * 100);
}

export function getPollutantStatus(component, value) {
  const thresholds = {
    pm25: [12, 35, 55, 150, 250],
    pm10: [54, 154, 254, 354, 424],
    no2: [53, 100, 360, 649, 1249],
    o3: [54, 70, 85, 105, 200],
    co: [4.4, 9.4, 12.4, 15.4, 30.4],
    so2: [35, 75, 185, 304, 604],
  };

  const labels = [
    "Good",
    "Moderate",
    "Unhealthy for Sensitive",
    "Unhealthy",
    "Very Unhealthy",
    "Hazardous",
  ];
  const colors = [
    "#10b981",
    "#f59e0b",
    "#f97316",
    "#ef4444",
    "#dc2626",
    "#7c3aed",
  ];

  const t = thresholds[component];
  if (!t) return { label: "N/A", color: "#6b7280" };

  const idx = t.findIndex((threshold) => value <= threshold);
  const i = idx === -1 ? 5 : idx;

  return { label: labels[i], color: colors[i] };
}

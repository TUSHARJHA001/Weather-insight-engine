import { clamp } from "@/shared/utils/index.js";

function tempScore(celsius) {
  if (celsius >= 18 && celsius <= 24) return 100;
  if (celsius > 24 && celsius <= 28) return 90;
  if (celsius > 28 && celsius <= 32) return 75;
  if (celsius > 32 && celsius <= 36) return 55;
  if (celsius > 36) return 30;
  if (celsius >= 10 && celsius < 18) return 80;
  if (celsius >= 5 && celsius < 10) return 50;
  return 20;
}

function humidityScore(pct) {
  if (pct >= 40 && pct <= 60) return 100;
  if (pct >= 30 && pct < 40) return 85;
  if (pct > 60 && pct <= 70) return 80;
  if (pct > 70 && pct <= 80) return 60;
  if (pct > 80) return 40;
  if (pct < 30) return 70;
  return 50;
}

function aqiScore(aqiValue) {
  // aqiValue is 0-300+ scale
  if (aqiValue <= 50) return 100;
  if (aqiValue <= 100) return 80;
  if (aqiValue <= 150) return 55;
  if (aqiValue <= 200) return 35;
  if (aqiValue <= 300) return 15;
  return 5;
}

function uvScore(uv) {
  if (uv === undefined || uv === null) return 80;
  if (uv <= 2) return 100;
  if (uv <= 5) return 85;
  if (uv <= 7) return 65;
  if (uv <= 10) return 40;
  return 15;
}

function windScore(ms) {
  if (ms <= 2) return 100;
  if (ms <= 5) return 90;
  if (ms <= 10) return 75;
  if (ms <= 15) return 55;
  if (ms <= 25) return 30;
  return 10;
}

function scoreLabel(score) {
  if (score >= 85) return { label: "Excellent", color: "#10b981" };
  if (score >= 70) return { label: "Good", color: "#22d3ee" };
  if (score >= 50) return { label: "Moderate", color: "#f59e0b" };
  if (score >= 35) return { label: "Poor", color: "#f97316" };
  return { label: "Hazardous", color: "#ef4444" };
}

function scoreExplanation(score, factors) {
  const issues = [];
  if (factors.temp < 60) issues.push("temperature outside comfort range");
  if (factors.aqi < 60) issues.push("degraded air quality");
  if (factors.humidity < 65) issues.push("uncomfortable humidity");
  if (factors.uv < 60) issues.push("high UV exposure");
  if (factors.wind < 55) issues.push("strong winds");

  if (!issues.length) return "Environmental conditions are excellent.";
  if (issues.length === 1) return `Conditions fair. Note: ${issues[0]}.`;
  return `Multiple factors: ${issues.slice(0, 2).join(", ")}.`;
}

/**
 * @param {object} weather - normalized CurrentWeather
 * @param {object|null} airQuality - normalized AirQuality
 * @returns {{ score: number, label: string, color: string, explanation: string, factors: object }}
 */
export function computeWeatherScore(weather, airQuality) {
  const factors = {
    temp: tempScore(weather.temperature),
    humidity: humidityScore(weather.humidity),
    aqi: aqiScore(airQuality?.aqi ?? 25),
    uv: uvScore(weather.uvIndex),
    wind: windScore(weather.windSpeed),
  };

  const raw =
    factors.temp * 0.3 +
    factors.aqi * 0.3 +
    factors.humidity * 0.15 +
    factors.uv * 0.15 +
    factors.wind * 0.1;

  const score = Math.round(clamp(raw, 0, 100));
  const { label, color } = scoreLabel(score);

  return {
    score,
    label,
    color,
    explanation: scoreExplanation(score, factors),
    factors,
  };
}

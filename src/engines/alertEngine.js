export function generateAlerts(weather, airQuality, forecast) {
  const alerts = [];
  const t = weather.temperature;
  const h = weather.humidity;
  const wind = weather.windSpeed;
  const vis = weather.visibility;
  const uv = weather.uvIndex || 0;
  const aqi = airQuality?.aqi ?? 0;

  // Heat alerts
  if (t > 42) {
    alerts.push({
      type: "heat",
      severity: "extreme",
      title: "Extreme Heat Warning",
      message: `Temperature at ${t.toFixed(1)}°C. Dangerous heat. Avoid outdoor exposure. Stay hydrated.`,
      icon: "flame",
    });
  } else if (t > 38) {
    alerts.push({
      type: "heat",
      severity: "high",
      title: "Heat Advisory",
      message: `Temperature at ${t.toFixed(1)}°C. Risk of heat exhaustion. Limit outdoor activity.`,
      icon: "thermometer",
    });
  }

  // Cold alerts
  if (t < -10) {
    alerts.push({
      type: "cold",
      severity: "extreme",
      title: "Extreme Cold Warning",
      message: `Temperature at ${t.toFixed(1)}°C. Risk of frostbite and hypothermia. Stay indoors.`,
      icon: "snowflake",
    });
  } else if (t < 0) {
    alerts.push({
      type: "cold",
      severity: "moderate",
      title: "Cold Advisory",
      message: `Freezing temperatures at ${t.toFixed(1)}°C. Dress in layers.`,
      icon: "thermometer",
    });
  }

  // Wind alerts
  if (wind > 28) {
    alerts.push({
      type: "wind",
      severity: "extreme",
      title: "Storm Warning",
      message: `Wind speed at ${wind.toFixed(1)} m/s. Dangerous conditions. Secure loose objects.`,
      icon: "wind",
    });
  } else if (wind > 17) {
    alerts.push({
      type: "wind",
      severity: "moderate",
      title: "Strong Wind Warning",
      message: `Wind speed at ${wind.toFixed(1)} m/s. Difficulty walking outdoors.`,
      icon: "wind",
    });
  }

  // Air quality alerts
  if (aqi > 200) {
    alerts.push({
      type: "aqi",
      severity: "extreme",
      title: "Hazardous Air Quality",
      message: `AQI at ${aqi}. Stay indoors. Run air purifiers. Wear N95 if going outside.`,
      icon: "cloud-fog",
    });
  } else if (aqi > 150) {
    alerts.push({
      type: "aqi",
      severity: "high",
      title: "Poor Air Quality Alert",
      message: `AQI at ${aqi}. Sensitive groups should avoid outdoor activity.`,
      icon: "cloud-fog",
    });
  } else if (aqi > 100) {
    alerts.push({
      type: "aqi",
      severity: "moderate",
      title: "Moderate Air Quality",
      message: `AQI at ${aqi}. Sensitive individuals may experience effects.`,
      icon: "cloud",
    });
  }

  // UV alerts
  if (uv >= 11) {
    alerts.push({
      type: "uv",
      severity: "extreme",
      title: "Extreme UV Warning",
      message: `UV Index at ${uv}. Maximum protection required. Avoid midday sun.`,
      icon: "sun",
    });
  } else if (uv >= 8) {
    alerts.push({
      type: "uv",
      severity: "high",
      title: "High UV Alert",
      message: `UV Index at ${uv}. Apply SPF 50+, wear protective clothing.`,
      icon: "sun",
    });
  }

  // Visibility
  if (vis < 1000) {
    alerts.push({
      type: "visibility",
      severity: "high",
      title: "Low Visibility Warning",
      message: `Visibility at ${(vis / 1000).toFixed(1)} km. Exercise caution while driving.`,
      icon: "eye-off",
    });
  }

  // Rain from forecast
  if (forecast?.hourly) {
    const next6h = forecast.hourly.slice(0, 2);
    const maxRain = Math.max(...next6h.map((h) => h.rainProbability));
    if (maxRain >= 80) {
      alerts.push({
        type: "rain",
        severity: "moderate",
        title: "Heavy Rain Alert",
        message: `${maxRain}% chance of heavy rain in the next 6 hours. Carry an umbrella.`,
        icon: "cloud-rain",
      });
    }
  }

  // Sort by severity
  const order = { extreme: 0, high: 1, moderate: 2, low: 3 };
  return alerts.sort(
    (a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4),
  );
}

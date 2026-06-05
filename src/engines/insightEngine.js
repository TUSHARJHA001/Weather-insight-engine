export function generateInsights(weather, forecast, airQuality) {
  const insights = [];

  if (!weather) return insights;

  const t = weather.temperature;
  const h = weather.humidity;
  const wind = weather.windSpeed;
  const aqi = airQuality?.aqi ?? 0;
  const hourly = forecast?.hourly ?? [];
  const daily = forecast?.daily ?? [];

  // Temperature trend
  if (hourly.length >= 4) {
    const now = hourly[0]?.temp;
    const later = hourly[3]?.temp;
    const diff = later - now;
    if (diff > 3)
      insights.push({
        type: "temp",
        icon: "trending-up",
        text: `Temperature rising ${diff.toFixed(1)}°C over the next 12 hours.`,
        category: "trend",
      });
    else if (diff < -3)
      insights.push({
        type: "temp",
        icon: "trending-down",
        text: `Temperature dropping ${Math.abs(diff).toFixed(1)}°C over the next 12 hours.`,
        category: "trend",
      });
  }

  // Humidity
  if (h > 80)
    insights.push({
      type: "humidity",
      icon: "droplets",
      text: "Humidity exceeds comfort threshold. Expect muggy conditions.",
      category: "condition",
    });
  else if (h < 25)
    insights.push({
      type: "humidity",
      icon: "droplets",
      text: "Very low humidity. Increased risk of dehydration and dry skin.",
      category: "condition",
    });

  // AQI trend (stable vs changing)
  if (aqi > 0) {
    if (aqi > 100)
      insights.push({
        type: "aqi",
        icon: "activity",
        text: "Air quality is degraded. Consider indoor exercise today.",
        category: "health",
      });
    else if (aqi <= 50)
      insights.push({
        type: "aqi",
        icon: "check-circle",
        text: "AQI remains in healthy range. Good conditions for outdoor activity.",
        category: "health",
      });
  }

  // Rain probability
  if (hourly.length) {
    const maxRain = Math.max(
      ...hourly.slice(0, 4).map((h) => h.rainProbability),
    );
    if (maxRain >= 70)
      insights.push({
        type: "rain",
        icon: "cloud-rain",
        text: `Rain probability reaching ${maxRain}% in the next 12 hours.`,
        category: "forecast",
      });
    else if (maxRain < 15 && hourly.length >= 4)
      insights.push({
        type: "rain",
        icon: "sun",
        text: "Low precipitation probability through the next 12 hours.",
        category: "forecast",
      });
  }

  // Wind
  if (wind > 15)
    insights.push({
      type: "wind",
      icon: "wind",
      text: `Wind speed at ${wind.toFixed(1)} m/s. Expect disruptions to outdoor activities.`,
      category: "condition",
    });
  else if (wind < 3 && t > 28)
    insights.push({
      type: "wind",
      icon: "thermometer",
      text: "Calm winds combined with high temperature increase heat stress risk.",
      category: "health",
    });

  // Daily forecast trend
  if (daily.length >= 3) {
    const d0 = daily[0];
    const d1 = daily[1];
    const d2 = daily[2];
    if (d1.tempMax > d0.tempMax + 3 && d2.tempMax > d1.tempMax) {
      insights.push({
        type: "trend",
        icon: "trending-up",
        text: "Forecast shows a multi-day warming trend ahead.",
        category: "trend",
      });
    } else if (d1.tempMax < d0.tempMax - 3 && d2.tempMax < d1.tempMax) {
      insights.push({
        type: "trend",
        icon: "trending-down",
        text: "Forecast shows a multi-day cooling trend ahead.",
        category: "trend",
      });
    }

    const rainDays = daily.filter((d) => d.rainProbability >= 60).length;
    if (rainDays >= 3)
      insights.push({
        type: "rain",
        icon: "cloud-rain",
        text: `Rainy conditions expected for ${rainDays} of the next ${daily.length} days.`,
        category: "forecast",
      });
  }

  // Visibility
  if (weather.visibility < 3000) {
    insights.push({
      type: "visibility",
      icon: "eye",
      text: `Reduced visibility at ${(weather.visibility / 1000).toFixed(1)} km. Exercise caution outdoors.`,
      category: "condition",
    });
  }

  // Feels like divergence
  const diff = Math.abs(t - weather.feelsLike);
  if (diff >= 5) {
    const dir = weather.feelsLike < t ? "cooler" : "warmer";
    insights.push({
      type: "feelslike",
      icon: "thermometer",
      text: `Feels ${diff.toFixed(0)}°C ${dir} than actual temperature due to ${dir === "cooler" ? "wind chill" : "humidity"}.`,
      category: "condition",
    });
  }

  return insights.slice(0, 6);
}

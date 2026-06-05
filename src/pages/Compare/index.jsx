import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import { fetchWeatherByCity } from "@/shared/services/api/weatherApi.js";
import { fetchAirQuality } from "@/shared/services/api/airQualityApi.js";
import { computeWeatherScore } from "@/engines/weatherScoreEngine.js";
import { formatTemp, windDirection, mToKm } from "@/shared/utils/index.js";
import { useSettingsStore, selectUnit } from "@/store/settingsStore.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import SearchBar from "@/shared/components/SearchBar.jsx";
import EmptyState from "@/shared/components/EmptyState.jsx";

const METRICS = [
  {
    key: "temperature",
    label: "Temperature",
    unit: (v, u) => formatTemp(v, u),
    raw: (w) => w.temperature,
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: (v) => `${v}%`,
    raw: (w) => w.humidity,
  },
  {
    key: "windSpeed",
    label: "Wind",
    unit: (v) => `${v.toFixed(1)} m/s`,
    raw: (w) => w.windSpeed,
  },
  {
    key: "pressure",
    label: "Pressure",
    unit: (v) => `${v} hPa`,
    raw: (w) => w.pressure,
  },
  {
    key: "visibility",
    label: "Visibility",
    unit: (v) => mToKm(v),
    raw: (w) => w.visibility,
  },
  {
    key: "cloudCover",
    label: "Cloud Cover",
    unit: (v) => `${v}%`,
    raw: (w) => w.cloudCover,
  },
];

function DiffIndicator({ a, b }) {
  const diff = b - a;
  if (Math.abs(diff) < 0.5)
    return <Minus size={12} className="text-text-muted" />;
  if (diff > 0) return <TrendingUp size={12} className="text-emerald-400" />;
  return <TrendingDown size={12} className="text-red-400" />;
}

export default function Compare() {
  const [cityA, setCityA] = useState(null);
  const [cityB, setCityB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const unit = useSettingsStore(selectUnit);

  async function loadCity(name, setter, setLoading) {
    setLoading(true);
    try {
      const weather = await fetchWeatherByCity(name);
      const aqi = await fetchAirQuality(weather.lat, weather.lon).catch(
        () => null,
      );
      const score = computeWeatherScore(weather, aqi);
      setter({ weather, aqi, score });
    } catch (e) {
      toast.error(`Could not find "${name}"`);
    } finally {
      setLoading(false);
    }
  }

  const radarData =
    cityA?.weather && cityB?.weather
      ? [
          {
            metric: "Temp Comfort",
            A: Math.max(0, 100 - Math.abs(cityA.weather.temperature - 22) * 4),
            B: Math.max(0, 100 - Math.abs(cityB.weather.temperature - 22) * 4),
          },
          {
            metric: "Humidity",
            A: Math.max(0, 100 - Math.abs(cityA.weather.humidity - 50)),
            B: Math.max(0, 100 - Math.abs(cityB.weather.humidity - 50)),
          },
          {
            metric: "Air Quality",
            A: cityA.score?.factors.aqi ?? 80,
            B: cityB.score?.factors.aqi ?? 80,
          },
          {
            metric: "Visibility",
            A: Math.min(100, cityA.weather.visibility / 100),
            B: Math.min(100, cityB.weather.visibility / 100),
          },
          {
            metric: "Wind",
            A: cityA.score?.factors.wind ?? 80,
            B: cityB.score?.factors.wind ?? 80,
          },
          {
            metric: "Overall",
            A: cityA.score?.score ?? 0,
            B: cityB.score?.score ?? 0,
          },
        ]
      : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div>
        <h1 className="font-display text-xl font-bold text-text-primary">
          Compare Cities
        </h1>
        <p className="text-text-muted text-xs mt-0.5">
          Side-by-side environmental comparison
        </p>
      </div>

      {/* Search inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardTitle className="mb-3">City A</CardTitle>
          <SearchBar
            onSearch={(c) => loadCity(c, setCityA, setLoadingA)}
            placeholder="Search city A..."
          />
          {loadingA && (
            <p className="text-text-muted text-xs mt-2 font-mono animate-pulse">
              Loading...
            </p>
          )}
          {cityA?.weather && (
            <CityBadge
              weather={cityA.weather}
              score={cityA.score}
              color="var(--accent-primary)"
            />
          )}
        </Card>

        <Card>
          <CardTitle className="mb-3">City B</CardTitle>
          <SearchBar
            onSearch={(c) => loadCity(c, setCityB, setLoadingB)}
            placeholder="Search city B..."
          />
          {loadingB && (
            <p className="text-text-muted text-xs mt-2 font-mono animate-pulse">
              Loading...
            </p>
          )}
          {cityB?.weather && (
            <CityBadge
              weather={cityB.weather}
              score={cityB.score}
              color="#a78bfa"
            />
          )}
        </Card>
      </div>

      {/* Comparison content */}
      {cityA && cityB ? (
        <>
          {/* Radar chart */}
          <Card>
            <CardTitle className="mb-4">Condition Comparison</CardTitle>
            <div className="flex items-center gap-4 mb-3 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />
                {cityA.weather.city}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" />
                {cityB.weather.city}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{
                    fill: "#4a607a",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Radar
                  name={cityA.weather.city}
                  dataKey="A"
                  stroke="var(--accent-primary)"
                  fill="var(--accent-primary)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name={cityB.weather.city}
                  dataKey="B"
                  stroke="#a78bfa"
                  fill="#a78bfa"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-default)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Metric rows */}
          <Card>
            <CardTitle className="mb-4">Detailed Comparison</CardTitle>
            <div className="space-y-2">
              {METRICS.map(({ key, label, unit: fmt, raw }) => {
                const valA = raw(cityA.weather);
                const valB = raw(cityB.weather);
                const pctDiff =
                  valA !== 0 ? ((valB - valA) / Math.abs(valA)) * 100 : 0;
                return (
                  <div
                    key={key}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5 border-b border-[var(--border-subtle)] last:border-0"
                  >
                    <div className="text-right">
                      <p className="text-text-primary text-sm font-medium metric-number">
                        {fmt(valA, unit)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 min-w-[90px]">
                      <p className="text-text-muted text-[10px] font-mono uppercase text-center">
                        {label}
                      </p>
                      <div className="flex items-center gap-1">
                        <DiffIndicator a={valA} b={valB} />
                        {Math.abs(pctDiff) > 0.5 && (
                          <span
                            className={`text-[10px] font-mono ${pctDiff > 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {pctDiff > 0 ? "+" : ""}
                            {pctDiff.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium metric-number">
                        {fmt(valB, unit)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Score comparison */}
          {cityA.score && cityB.score && (
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard
                city={cityA.weather.city}
                score={cityA.score}
                color="var(--accent-primary)"
              />
              <ScoreCard
                city={cityB.weather.city}
                score={cityB.score}
                color="#a78bfa"
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={GitCompare}
          title="Select two cities"
          description="Search for two cities above to compare their environmental conditions side by side."
        />
      )}
    </motion.div>
  );
}

function CityBadge({ weather, score, color }) {
  return (
    <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-white/5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: `${color}22`, color }}
      >
        {weather.city[0]}
      </div>
      <div>
        <p className="text-text-primary text-sm font-medium">
          {weather.city}, {weather.country}
        </p>
        <p className="text-text-muted text-xs">
          {Math.round(weather.temperature)}°C · {weather.description}
        </p>
      </div>
      {score && (
        <div className="ml-auto text-right">
          <p className="text-xs font-mono" style={{ color: score.color }}>
            {score.score}
          </p>
          <p className="text-[10px] text-text-muted">score</p>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ city, score, color }) {
  const circ = 2 * Math.PI * 36;
  const offset = circ - (score.score / 100) * circ;
  return (
    <Card>
      <CardTitle className="mb-3">{city}</CardTitle>
      <div className="flex items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="5"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute" style={{ position: "relative", left: 0 }}>
          <p className="metric-number text-2xl font-light" style={{ color }}>
            {score.score}
          </p>
          <p className="text-text-muted text-xs">{score.label}</p>
        </div>
        <div className="flex-1">
          <p className="text-text-muted text-xs leading-relaxed">
            {score.explanation}
          </p>
        </div>
      </div>
    </Card>
  );
}

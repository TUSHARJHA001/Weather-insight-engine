import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  useWeatherStore,
  selectForecast,
  selectCurrent,
  selectLoading,
} from "@/store/weatherStore.js";
import { computeWeatherScore } from "@/engines/weatherScoreEngine.js";
import { formatHour, formatDay } from "@/shared/utils/index.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import EmptyState from "@/shared/components/EmptyState.jsx";
import { BarChart3 } from "lucide-react";

const TIME_RANGES = [
  { label: "24H", count: 8 },
  { label: "3D", count: 24 },
  { label: "5D", count: 36 },
  { label: "7D", count: 40 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-[var(--border-default)] text-xs space-y-1">
      <p className="text-text-muted font-mono mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="text-text-primary font-mono">
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const forecast = useWeatherStore(selectForecast);
  const current = useWeatherStore(selectCurrent);
  const loading = useWeatherStore(selectLoading);
  const [range, setRange] = useState("5D");

  const rangeConfig =
    TIME_RANGES.find((r) => r.label === range) || TIME_RANGES[2];

  const chartData = useMemo(() => {
    if (!forecast?.hourly) return [];
    const sliced = forecast.hourly.slice(0, rangeConfig.count);
    return sliced.map((h, i) => ({
      time:
        rangeConfig.count <= 8
          ? formatHour(h.timestamp)
          : i % 4 === 0
            ? formatDay(h.timestamp)
            : "",
      temp: Math.round(h.temp * 10) / 10,
      feelsLike: Math.round(h.feelsLike * 10) / 10,
      humidity: h.humidity,
      pressure: h.pressure,
      wind: Math.round(h.windSpeed * 10) / 10,
      rain: h.rainProbability,
      cloud: h.cloudCover,
      comfort: computeWeatherScore(
        {
          temperature: h.temp,
          humidity: h.humidity,
          windSpeed: h.windSpeed,
          feelsLike: h.feelsLike,
        },
        null,
      ).score,
    }));
  }, [forecast, range]);

  if (!current && !loading) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data available"
        description="Search for a city on the Dashboard first."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header + range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-text-primary">
            Analytics
          </h1>
          <p className="text-text-muted text-xs mt-0.5">
            {current?.city} · Weather Intelligence
          </p>
        </div>
        <div className="flex gap-1 glass rounded-xl p-1">
          {TIME_RANGES.map(({ label }) => (
            <button
              key={label}
              onClick={() => setRange(label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${range === label ? "bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--border-default)]" : "text-text-muted hover:text-text-secondary"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature & Feels Like */}
      <ChartCard title="Temperature Trend" subtitle="°C">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CC9F0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4CC9F0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="time"
              tick={{
                fill: "#4a607a",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{
                fill: "#4a607a",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
              tickLine={false}
              axisLine={false}
              unit="°"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: 11,
                fontFamily: "JetBrains Mono",
                color: "#8fa3bf",
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              name="Temp"
              stroke="#4CC9F0"
              fill="url(#tempGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#4CC9F0" }}
            />
            <Area
              type="monotone"
              dataKey="feelsLike"
              name="Feels Like"
              stroke="#f59e0b"
              fill="url(#feelsGrad)"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 2"
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Humidity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Humidity Trend" subtitle="%">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#22d3ee"
                fill="url(#humGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Wind Speed Trend" subtitle="m/s">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wind"
                name="Wind"
                stroke="#34d399"
                fill="url(#windGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pressure */}
      <ChartCard title="Pressure Trend" subtitle="hPa">
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="time"
              tick={{
                fill: "#4a607a",
                fontSize: 9,
                fontFamily: "JetBrains Mono",
              }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{
                fill: "#4a607a",
                fontSize: 9,
                fontFamily: "JetBrains Mono",
              }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="pressure"
              name="Pressure"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Rain + Cloud */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Rain Probability" subtitle="%">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rain"
                name="Rain %"
                stroke="#3b82f6"
                fill="url(#rainGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Comfort Score Trend" subtitle="/100">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="comfortGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{
                  fill: "#4a607a",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono",
                }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="comfort"
                name="Comfort"
                stroke="#10b981"
                fill="url(#comfortGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <Card>
      <div className="flex items-baseline gap-2 mb-4">
        <CardTitle>{title}</CardTitle>
        <span className="text-text-muted text-[10px] font-mono">
          {subtitle}
        </span>
      </div>
      {children}
    </Card>
  );
}

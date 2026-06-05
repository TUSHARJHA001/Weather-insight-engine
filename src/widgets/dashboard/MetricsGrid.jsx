import { motion } from "framer-motion";
import {
  Sunrise,
  Sunset,
  Gauge,
  Cloud,
  Thermometer,
  Eye,
  Wind,
  Droplets,
} from "lucide-react";
import {
  useWeatherStore,
  selectCurrent,
  selectLoading,
} from "@/store/weatherStore.js";
import {
  formatTime,
  mToKm,
  windDirection,
  pressureStatus,
} from "@/shared/utils/index.js";
import Skeleton from "@/shared/components/Skeleton.jsx";

export default function MetricsGrid() {
  const current = useWeatherStore(selectCurrent);
  const loading = useWeatherStore(selectLoading);

  if (loading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  if (!current) return null;

  const pressure = pressureStatus(current.pressure);

  const metrics = [
    {
      icon: Sunrise,
      label: "Sunrise",
      value: formatTime(current.sunrise),
      color: "#fbbf24",
    },
    {
      icon: Sunset,
      label: "Sunset",
      value: formatTime(current.sunset),
      color: "#f97316",
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${current.pressure} hPa`,
      sub: pressure.label,
      color: pressure.color,
    },
    {
      icon: Cloud,
      label: "Cloud Cover",
      value: `${current.cloudCover}%`,
      color: "#94a3b8",
    },
    {
      icon: Droplets,
      label: "Dew Point",
      value: `${(current.temperature - (100 - current.humidity) / 5).toFixed(1)}°C`,
      color: "#22d3ee",
    },
    {
      icon: Eye,
      label: "Visibility",
      value: mToKm(current.visibility),
      color: "#a78bfa",
    },
    {
      icon: Wind,
      label: "Wind Dir",
      value: windDirection(current.windDeg),
      color: "#34d399",
    },
    {
      icon: Thermometer,
      label: "Heat Index",
      value: `${(current.temperature + (current.humidity - 40) * 0.1).toFixed(1)}°C`,
      color: "#fb923c",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      role="list"
      aria-label="Weather metrics"
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          className="glass rounded-2xl p-3.5 flex items-center gap-3"
          role="listitem"
          aria-label={`${m.label}: ${m.value}`}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${m.color}18` }}
          >
            <m.icon size={15} style={{ color: m.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-text-muted text-[10px] font-mono uppercase tracking-wider truncate">
              {m.label}
            </p>
            <p className="text-text-primary text-sm font-medium metric-number truncate">
              {m.value}
            </p>
            {m.sub && (
              <p className="text-[10px] font-mono" style={{ color: m.color }}>
                {m.sub}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from "framer-motion";
import { MapPin, Eye, Droplets, Wind, Thermometer } from "lucide-react";
import {
  useWeatherStore,
  selectCurrent,
  selectLoading,
} from "@/store/weatherStore.js";
import { useSettingsStore, selectUnit } from "@/store/settingsStore.js";
import {
  formatTemp,
  windDirection,
  mToKm,
  formatTime,
  getWeatherIconUrl,
} from "@/shared/utils/index.js";
import Skeleton from "@/shared/components/Skeleton.jsx";

export default function HeroWeather() {
  const current = useWeatherStore(selectCurrent);
  const loading = useWeatherStore(selectLoading);
  const unit = useSettingsStore(selectUnit);

  if (loading) return <HeroSkeleton />;
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 relative overflow-hidden"
    >
      {/* Glow accent */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: "var(--accent-primary)",
          transform: "translate(30%, -30%)",
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: Location + temp */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-text-muted mb-3">
            <MapPin size={13} />
            <span className="text-xs font-mono tracking-wider uppercase">
              {current.city}, {current.country}
            </span>
            <span className="ml-2 text-xs opacity-50">
              Updated {formatTime(current.timestamp)}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div>
              <p className="metric-number text-7xl font-light text-text-primary leading-none">
                {formatTemp(current.temperature, unit)
                  .replace("°C", "")
                  .replace("°F", "")}
              </p>
              <p className="text-text-muted text-lg mt-1">
                {unit === "F" ? "°F" : "°C"}
              </p>
            </div>

            <div className="pt-2">
              <img
                src={getWeatherIconUrl(current.icon)}
                alt={current.description}
                width={64}
                height={64}
                className="drop-shadow-lg"
                loading="eager"
              />
            </div>
          </div>

          <p className="text-text-secondary text-base mt-1 capitalize">
            {current.description}
          </p>

          <div className="flex items-center gap-1 mt-1 text-sm text-text-muted">
            <Thermometer size={12} />
            <span>Feels like {formatTemp(current.feelsLike, unit)}</span>
            <span className="mx-2 opacity-30">·</span>
            <span>
              H:{formatTemp(current.tempMax, unit)} L:
              {formatTemp(current.tempMin, unit)}
            </span>
          </div>
        </div>

        {/* Right: Quick stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:w-44">
          <QuickStat
            icon={Wind}
            label="Wind"
            value={`${current.windSpeed.toFixed(1)} m/s ${windDirection(current.windDeg)}`}
          />
          <QuickStat
            icon={Droplets}
            label="Humidity"
            value={`${current.humidity}%`}
          />
          <QuickStat
            icon={Eye}
            label="Visibility"
            value={mToKm(current.visibility)}
          />
          <QuickStat
            icon={Thermometer}
            label="Pressure"
            value={`${current.pressure} hPa`}
          />
        </div>
      </div>
    </motion.div>
  );
}

function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5">
      <Icon size={14} className="text-[var(--accent-primary)] shrink-0" />
      <div className="min-w-0">
        <p className="text-text-muted text-[10px] uppercase tracking-wider font-mono">
          {label}
        </p>
        <p className="text-text-primary text-xs font-medium truncate metric-number">
          {value}
        </p>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="glass rounded-3xl p-6">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-20 w-48 mb-2" />
      <Skeleton className="h-5 w-32 mb-6" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

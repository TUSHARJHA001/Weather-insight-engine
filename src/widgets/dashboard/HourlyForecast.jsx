import { motion } from "framer-motion";
import {
  useWeatherStore,
  selectForecast,
  selectLoading,
} from "@/store/weatherStore.js";
import { useSettingsStore, selectUnit } from "@/store/settingsStore.js";
import {
  formatTemp,
  formatHour,
  getWeatherIconUrl,
} from "@/shared/utils/index.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";

export default function HourlyForecast() {
  const forecast = useWeatherStore(selectForecast);
  const loading = useWeatherStore(selectLoading);
  const unit = useSettingsStore(selectUnit);

  if (loading || !forecast?.hourly?.length) return null;

  const hours = forecast.hourly.slice(0, 12);

  return (
    <Card>
      <CardTitle className="mb-4">Hourly Forecast</CardTitle>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {hours.map((h, i) => (
          <motion.div
            key={h.timestamp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 min-w-[64px]"
          >
            <span className="text-[10px] font-mono text-text-muted">
              {formatHour(h.timestamp)}
            </span>
            <img
              src={getWeatherIconUrl(h.icon)}
              alt={h.description}
              width={32}
              height={32}
              loading="lazy"
            />
            <span className="text-xs font-medium text-text-primary metric-number">
              {formatTemp(h.temp, unit)}
            </span>
            {h.rainProbability > 10 && (
              <span className="text-[10px] text-blue-400 font-mono">
                {h.rainProbability}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

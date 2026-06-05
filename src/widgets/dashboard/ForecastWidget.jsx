import { motion } from "framer-motion";
import {
  useWeatherStore,
  selectForecast,
  selectLoading,
} from "@/store/weatherStore.js";
import { useSettingsStore, selectUnit } from "@/store/settingsStore.js";
import {
  formatTemp,
  formatDay,
  getWeatherIconUrl,
} from "@/shared/utils/index.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import Skeleton from "@/shared/components/Skeleton.jsx";

export default function ForecastWidget() {
  const forecast = useWeatherStore(selectForecast);
  const loading = useWeatherStore(selectLoading);
  const unit = useSettingsStore(selectUnit);

  if (loading)
    return (
      <Card>
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-24 shrink-0 rounded-xl" />
          ))}
        </div>
      </Card>
    );

  if (!forecast?.daily?.length) return null;

  return (
    <Card>
      <CardTitle className="mb-4">5-Day Forecast</CardTitle>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {forecast.daily.slice(0, 7).map((day, i) => (
          <motion.div
            key={day.timestamp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="shrink-0 flex flex-col items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-default min-w-[80px]"
          >
            <span className="text-text-muted text-xs font-mono uppercase">
              {formatDay(day.timestamp)}
            </span>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              width={40}
              height={40}
              loading="lazy"
              className="drop-shadow"
            />
            <div className="text-center">
              <p className="text-text-primary text-sm font-medium metric-number">
                {formatTemp(day.tempMax, unit)}
              </p>
              <p className="text-text-muted text-xs metric-number">
                {formatTemp(day.tempMin, unit)}
              </p>
            </div>
            {day.rainProbability > 20 && (
              <span className="text-[10px] font-mono text-blue-400">
                {day.rainProbability}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

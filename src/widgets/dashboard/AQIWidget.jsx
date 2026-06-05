import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import {
  useWeatherStore,
  selectAirQuality,
  selectLoading,
} from "@/store/weatherStore.js";
import {
  classifyAirQuality,
  getAqiBarWidth,
} from "@/engines/airQualityEngine.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import Skeleton from "@/shared/components/Skeleton.jsx";

export default function AQIWidget() {
  const airQuality = useWeatherStore(selectAirQuality);
  const loading = useWeatherStore(selectLoading);

  if (loading)
    return (
      <Card>
        <Skeleton className="h-40" />
      </Card>
    );
  if (!airQuality) {
    return (
      <Card>
        <CardTitle className="mb-4">Air Quality</CardTitle>
        <p className="text-text-muted text-sm">AQI data unavailable.</p>
      </Card>
    );
  }

  const classification = classifyAirQuality(airQuality.aqi);
  const barW = getAqiBarWidth(airQuality.aqi);

  const pollutants = [
    { key: "PM2.5", value: airQuality.pm25, unit: "μg/m³" },
    { key: "PM10", value: airQuality.pm10, unit: "μg/m³" },
    { key: "NO₂", value: airQuality.no2, unit: "μg/m³" },
    { key: "O₃", value: airQuality.o3, unit: "μg/m³" },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Air Quality Index</CardTitle>
        <Wind size={14} style={{ color: classification.color }} />
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="metric-number text-3xl font-light"
          style={{ color: classification.color }}
        >
          {airQuality.aqi}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: classification.color }}
        >
          {classification.classification}
        </span>
      </div>

      {/* Bar */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, #10b981, #f59e0b, #ef4444, #7c3aed)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${barW}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <p className="text-text-muted text-xs mb-3 leading-relaxed">
        {classification.recommendation}
      </p>

      {/* Pollutants */}
      <div className="grid grid-cols-2 gap-2">
        {pollutants.map(({ key, value, unit }) => (
          <div key={key} className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-text-muted text-[10px] font-mono">{key}</p>
            <p className="text-text-secondary text-xs font-medium metric-number">
              {value}{" "}
              <span className="text-text-muted text-[10px]">{unit}</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

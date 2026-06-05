import { motion } from "framer-motion";
import {
  useWeatherStore,
  selectScore,
  selectLoading,
} from "@/store/weatherStore.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import Skeleton from "@/shared/components/Skeleton.jsx";

export default function WeatherScoreWidget() {
  const score = useWeatherStore(selectScore);
  const loading = useWeatherStore(selectLoading);

  if (loading)
    return (
      <Card>
        <Skeleton className="h-36" />
      </Card>
    );
  if (!score) return null;

  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (score.score / 100) * circumference;

  const factorBars = [
    { label: "Temp", value: score.factors.temp },
    { label: "AQI", value: score.factors.aqi },
    { label: "Humid", value: score.factors.humidity },
    { label: "UV", value: score.factors.uv },
    { label: "Wind", value: score.factors.wind },
  ];

  return (
    <Card>
      <CardTitle className="mb-4">Health Score</CardTitle>
      <div className="flex items-center gap-6">
        {/* SVG ring */}
        <div className="relative shrink-0">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className="score-ring -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={score.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="metric-number text-2xl font-semibold"
              style={{ color: score.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score.score}
            </motion.span>
            <span className="text-[10px] text-text-muted font-mono uppercase">
              /100
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-semibold text-base mb-0.5">
            {score.label}
          </p>
          <p className="text-text-muted text-xs mb-3 line-clamp-2">
            {score.explanation}
          </p>

          {/* Factor bars */}
          <div className="space-y-1.5">
            {factorBars.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-text-muted text-[10px] font-mono w-10 shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: score.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
                <span className="text-text-muted text-[10px] font-mono w-6 text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

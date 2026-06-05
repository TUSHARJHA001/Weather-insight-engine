import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Activity,
  CloudRain,
  Wind,
  Sun,
  Eye,
  Thermometer,
  CheckCircle,
} from "lucide-react";
import {
  useWeatherStore,
  selectInsights,
  selectLoading,
} from "@/store/weatherStore.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";

const ICON_MAP = {
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  droplets: Droplets,
  activity: Activity,
  "cloud-rain": CloudRain,
  wind: Wind,
  sun: Sun,
  eye: Eye,
  thermometer: Thermometer,
  feelslike: Thermometer,
  "check-circle": CheckCircle,
};

const CATEGORY_COLOR = {
  trend: "#22d3ee",
  health: "#10b981",
  condition: "#f59e0b",
  forecast: "#3b82f6",
};

export default function InsightsWidget() {
  const insights = useWeatherStore(selectInsights);
  const loading = useWeatherStore(selectLoading);

  if (loading || !insights.length) return null;

  return (
    <Card>
      <CardTitle className="mb-4">Environmental Insights</CardTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {insights.map((insight, i) => {
          const Icon = ICON_MAP[insight.icon] || Activity;
          const color = CATEGORY_COLOR[insight.category] || "#4CC9F0";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${color}18` }}
              >
                <Icon size={13} style={{ color }} />
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {insight.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

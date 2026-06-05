import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Wind,
  Cloud,
  Sun,
  Snowflake,
  Eye,
  Thermometer,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  useWeatherStore,
  selectAlerts,
  selectLoading,
} from "@/store/weatherStore.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";

const ICON_MAP = {
  flame: Flame,
  wind: Wind,
  cloud: Cloud,
  "cloud-fog": Cloud,
  sun: Sun,
  snowflake: Snowflake,
  "eye-off": Eye,
  thermometer: Thermometer,
  "cloud-rain": CloudRain,
};

const SEVERITY_COLORS = {
  extreme: "#ef4444",
  high: "#f97316",
  moderate: "#f59e0b",
  low: "#22d3ee",
};

export default function AlertCenter() {
  const alerts = useWeatherStore(selectAlerts);
  const loading = useWeatherStore(selectLoading);

  if (loading) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Alert Center</CardTitle>
        <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded-full">
          {alerts.length} active
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {alerts.length === 0 ? (
          <motion.div
            key="clear"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 text-sm"
          >
            <CheckCircle2 size={16} className="text-[#10b981]" />
            <span className="text-text-secondary">
              No active alerts. Conditions are normal.
            </span>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map((alert, i) => {
              const Icon = ICON_MAP[alert.icon] || AlertTriangle;
              const color = SEVERITY_COLORS[alert.severity] || "#f59e0b";
              return (
                <motion.div
                  key={`${alert.type}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{
                    background: `${color}11`,
                    border: `1px solid ${color}33`,
                  }}
                  role="alert"
                  aria-label={alert.title}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${color}22` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color }}>
                      {alert.title}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}

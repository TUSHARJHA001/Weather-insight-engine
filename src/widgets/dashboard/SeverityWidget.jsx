import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import {
  useWeatherStore,
  selectSeverity,
  selectLoading,
} from "@/store/weatherStore.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import Skeleton from "@/shared/components/Skeleton.jsx";

const LEVELS = 7;

export default function SeverityWidget() {
  const severity = useWeatherStore(selectSeverity);
  const loading = useWeatherStore(selectLoading);

  if (loading)
    return (
      <Card>
        <Skeleton className="h-32" />
      </Card>
    );
  if (!severity) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Severity Status</CardTitle>
        <Activity size={14} style={{ color: severity.color }} />
      </div>

      <div
        className="flex items-end gap-1 mb-4"
        aria-label={`Severity level ${severity.level} of 7`}
      >
        {Array.from({ length: LEVELS }).map((_, i) => {
          const active = i < severity.level;
          const isCurrentLevel = i === severity.level - 1;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "backOut" }}
              style={{
                flex: 1,
                height: `${(i + 1) * 5 + 10}px`,
                background: active ? severity.color : "var(--border-subtle)",
                opacity: isCurrentLevel ? 1 : active ? 0.5 : 0.2,
                transformOrigin: "bottom",
                borderRadius: "2px",
              }}
            />
          );
        })}
      </div>

      <div>
        <p className="font-semibold text-sm" style={{ color: severity.color }}>
          Level {severity.level} — {severity.title}
        </p>
        <p className="text-text-muted text-xs mt-0.5 leading-relaxed">
          {severity.description}
        </p>
      </div>
    </Card>
  );
}

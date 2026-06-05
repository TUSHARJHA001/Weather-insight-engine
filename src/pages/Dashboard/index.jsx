import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useWeatherStore,
  selectLoading,
  selectError,
  selectCurrent,
} from "@/store/weatherStore.js";
import { useEnvironmentStore } from "@/store/environmentStore.js";
import { useSettingsStore } from "@/store/settingsStore.js";
import { getUserLocation } from "@/shared/services/api/locationApi.js";
import HeroWeather from "@/widgets/dashboard/HeroWeather.jsx";
import WeatherScoreWidget from "@/widgets/dashboard/WeatherScoreWidget.jsx";
import SeverityWidget from "@/widgets/dashboard/SeverityWidget.jsx";
import AQIWidget from "@/widgets/dashboard/AQIWidget.jsx";
import AlertCenter from "@/widgets/dashboard/AlertCenter.jsx";
import ForecastWidget from "@/widgets/dashboard/ForecastWidget.jsx";
import HourlyForecast from "@/widgets/dashboard/HourlyForecast.jsx";
import MetricsGrid from "@/widgets/dashboard/MetricsGrid.jsx";
import InsightsWidget from "@/widgets/dashboard/InsightsWidget.jsx";
import EmptyState from "@/shared/components/EmptyState.jsx";

export default function Dashboard() {
  const { fetchByCity, fetchByCoords, clearError } = useWeatherStore();
  const loading = useWeatherStore(selectLoading);
  const error = useWeatherStore(selectError);
  const current = useWeatherStore(selectCurrent);
  const updateEnv = useEnvironmentStore((s) => s.updateFromWeather);
  const defaultCity = useSettingsStore((s) => s.defaultCity);

  useEffect(() => {
    if (!current) {
      fetchByCity(defaultCity);
    }
  }, []);

  useEffect(() => {
    if (current) updateEnv(current);
  }, [current]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  function handleGeolocate() {
    getUserLocation()
      .then(({ lat, lon }) => fetchByCoords(lat, lon))
      .catch(() => toast.error("Location access denied."));
  }

  if (!current && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <EmptyState
          title="No location selected"
          description="Search for a city or use your current location to get started."
          action={
            <button
              onClick={handleGeolocate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-strong border border-[var(--border-default)] text-sm font-medium text-text-primary hover:border-[var(--accent-primary)] transition-all"
            >
              <MapPin size={15} />
              Use My Location
            </button>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Location button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-muted text-xs font-mono">
          {loading && (
            <>
              <Loader2 size={12} className="animate-spin" /> Fetching data...
            </>
          )}
        </div>
        <button
          onClick={handleGeolocate}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
          aria-label="Use current location"
        >
          <MapPin size={12} />
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Hero */}
      <HeroWeather />

      {/* Score + Severity + AQI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeatherScoreWidget />
        <SeverityWidget />
        <AQIWidget />
      </div>

      {/* Alerts */}
      <AlertCenter />

      {/* Hourly */}
      <HourlyForecast />

      {/* 5-day forecast */}
      <ForecastWidget />

      {/* Metrics grid */}
      <MetricsGrid />

      {/* Insights */}
      <InsightsWidget />
    </motion.div>
  );
}

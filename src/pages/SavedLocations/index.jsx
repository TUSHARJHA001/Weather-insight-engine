import { useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Bookmark,
  Pin,
  PinOff,
  Trash2,
  Plus,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useSavedLocationsStore } from "@/store/savedLocationsStore.js";
import { useWeatherStore } from "@/store/weatherStore.js";
import { getWeatherIconUrl } from "@/shared/utils/index.js";
import Card, { CardTitle } from "@/shared/components/Card.jsx";
import SearchBar from "@/shared/components/SearchBar.jsx";
import EmptyState from "@/shared/components/EmptyState.jsx";
import Badge from "@/shared/components/Badge.jsx";

export default function SavedLocations() {
  const {
    locations,
    addLocation,
    removeLocation,
    togglePin,
    reorderLocations,
    refreshAll,
    getWeatherForCity,
  } = useSavedLocationsStore();
  const { fetchByCity } = useWeatherStore();

  useEffect(() => {
    if (locations.length) refreshAll();
  }, []);

  function handleAdd(city) {
    addLocation(city);
    toast.success(`${city} saved`);
  }

  function handleRemove(city) {
    removeLocation(city);
    toast.info(`${city} removed`);
  }

  function handleLoad(city) {
    fetchByCity(city);
    toast.success(`Loading ${city}...`);
  }

  const sorted = [...locations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.addedAt - a.addedAt;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-text-primary">
            Saved Locations
          </h1>
          <p className="text-text-muted text-xs mt-0.5">
            {locations.length} location{locations.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <button
          onClick={refreshAll}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
          aria-label="Refresh all locations"
        >
          <RefreshCw size={12} />
          <span className="hidden sm:block">Refresh</span>
        </button>
      </div>

      {/* Add location */}
      <Card>
        <CardTitle className="mb-3">Add Location</CardTitle>
        <SearchBar
          onSearch={handleAdd}
          placeholder="Search and save a city..."
        />
      </Card>

      {/* Location list */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved locations"
          description="Search for a city above and save it for quick access."
        />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {sorted.map((loc) => {
              const data = getWeatherForCity(loc.city);
              return (
                <motion.div
                  key={loc.city}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LocationCard
                    loc={loc}
                    data={data}
                    onLoad={() => handleLoad(loc.city)}
                    onRemove={() => handleRemove(loc.city)}
                    onPin={() => togglePin(loc.city)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function LocationCard({ loc, data, onLoad, onRemove, onPin }) {
  const w = data?.weather;
  const aqi = data?.aqi;
  const updatedAt = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`glass rounded-2xl p-4 flex items-center gap-4 border transition-all hover:border-[var(--border-default)] ${loc.pinned ? "border-[var(--accent-primary)]/30" : "border-transparent"}`}
    >
      {/* Pin indicator */}
      {loc.pinned && (
        <div className="w-1 h-8 rounded-full bg-[var(--accent-primary)] shrink-0" />
      )}

      {/* Icon / weather */}
      <div className="w-12 h-12 shrink-0 flex items-center justify-center">
        {w ? (
          <img
            src={getWeatherIconUrl(w.icon)}
            alt={w.description}
            width={48}
            height={48}
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <MapPin size={16} className="text-text-muted" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-text-primary font-medium text-sm truncate">
            {loc.city}
          </p>
          {loc.pinned && (
            <Badge
              color="var(--accent-primary)"
              className="text-[10px] px-1.5 py-0"
            >
              Pinned
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
          {w && (
            <>
              <span className="metric-number font-medium text-text-secondary">
                {Math.round(w.temperature)}°C
              </span>
              <span className="capitalize">{w.description}</span>
            </>
          )}
          {aqi && (
            <span className="font-mono" style={{ color: aqi.color }}>
              AQI {aqi.aqi}
            </span>
          )}
          {updatedAt && <span className="opacity-50">Updated {updatedAt}</span>}
          {!w && <span className="animate-pulse">Fetching...</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onLoad}
          className="p-2 rounded-lg text-text-muted hover:text-[var(--accent-primary)] hover:bg-[var(--accent-muted)] transition-all"
          aria-label={`Load weather for ${loc.city}`}
          title="Load on dashboard"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={onPin}
          className={`p-2 rounded-lg transition-all ${loc.pinned ? "text-[var(--accent-primary)] bg-[var(--accent-muted)]" : "text-text-muted hover:text-text-primary hover:bg-white/5"}`}
          aria-label={loc.pinned ? "Unpin" : "Pin"}
          title={loc.pinned ? "Unpin" : "Pin to top"}
        >
          {loc.pinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
          aria-label={`Remove ${loc.city}`}
          title="Remove"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

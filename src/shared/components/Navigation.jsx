import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  GitCompare,
  Bookmark,
  Zap,
  WifiOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/index.js";
import { useWeatherStore, selectActiveCity } from "@/store/weatherStore.js";
import SearchBar from "./SearchBar.jsx";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/compare", icon: GitCompare, label: "Compare" },
  { to: "/saved", icon: Bookmark, label: "Saved" },
];

export default function Navigation({ isOffline }) {
  const { fetchByCity } = useWeatherStore();
  const activeCity = useWeatherStore(selectActiveCity);
  const location = useLocation();

  return (
    <nav
      className="glass-strong border-b border-[var(--border-subtle)] px-4 py-0 flex items-center h-14 gap-4 relative z-20"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
          <Zap size={14} className="text-black" fill="currentColor" />
        </div>
        <span className="font-display font-bold text-sm text-text-primary hidden sm:block tracking-tight">
          WeatherIQ
        </span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-0.5" role="list">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              role="listitem"
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                active
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary hover:bg-white/5",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "var(--accent-muted)",
                    border: "1px solid var(--border-default)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={14} className="relative z-10 shrink-0" />
              <span className="relative z-10 hidden md:block">{label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs ml-auto">
        <SearchBar
          onSearch={fetchByCity}
          placeholder={activeCity ? `${activeCity}` : "Search city..."}
        />
      </div>

      {/* Offline indicator */}
      {isOffline && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium shrink-0">
          <WifiOff size={12} />
          <span className="hidden sm:block">Offline</span>
        </div>
      )}
    </nav>
  );
}

import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <div>
        <p className="text-text-primary font-medium mb-1">
          Something went wrong
        </p>
        <p className="text-text-muted text-sm max-w-xs">
          {message || "Unable to fetch weather data. Check your connection."}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-primary glass hover:border-[var(--border-default)] border border-transparent transition-all"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </motion.div>
  );
}

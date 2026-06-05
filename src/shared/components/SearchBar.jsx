import { useState, useRef, useEffect } from "react";
import { Search, Mic, MicOff, X, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeatherStore, selectRecentSearches } from "@/store/weatherStore.js";
import { cn } from "@/shared/utils/index.js";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function SearchBar({
  className,
  onSearch,
  placeholder = "Search city...",
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const recentSearches = useWeatherStore(selectRecentSearches);
  const inputRef = useRef(null);
  const recogRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSubmit(city) {
    const q = (city || value).trim();
    if (!q) return;
    onSearch?.(q);
    setValue("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setOpen(false);
      setValue("");
    }
  }

  function startVoice() {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    recogRef.current = rec;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setValue(transcript);
      setListening(false);
      handleSubmit(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  }

  function stopVoice() {
    recogRef.current?.stop();
    setListening(false);
  }

  const filtered = recentSearches
    .filter((s) =>
      value ? s.toLowerCase().includes(value.toLowerCase()) : true,
    )
    .slice(0, 6);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl glass transition-all duration-200",
          "border border-transparent",
          open
            ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-muted)]"
            : "hover:border-[var(--border-default)]",
        )}
      >
        <Search size={15} className="text-text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent text-text-primary placeholder:text-text-muted text-sm flex-1 outline-none min-w-0"
          aria-label="Search city"
          autoComplete="off"
        />
        {value && (
          <button
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="text-text-muted hover:text-text-primary"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
        {SpeechRecognition && (
          <button
            onClick={listening ? stopVoice : startVoice}
            className={cn(
              "text-text-muted hover:text-accent-primary transition-colors",
              listening && "text-red-400 animate-pulse",
            )}
            aria-label={listening ? "Stop voice input" : "Start voice input"}
          >
            {listening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 glass-strong rounded-xl overflow-hidden z-50 border border-[var(--border-default)]"
          >
            <div className="py-1">
              <p className="px-4 py-1.5 text-xs text-text-muted font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={11} /> Recent
              </p>
              {filtered.map((city) => (
                <button
                  key={city}
                  className="w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 flex items-center gap-2.5 transition-colors"
                  onClick={() => handleSubmit(city)}
                >
                  <MapPin size={13} className="text-text-muted shrink-0" />
                  {city}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

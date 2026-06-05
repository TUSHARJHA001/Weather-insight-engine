import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navigation from "@/shared/components/Navigation.jsx";
import ShaderContainer from "@/shaders/ShaderContainer.jsx";
import { useEnvironmentStore, selectTheme } from "@/store/environmentStore.js";

export default function AppLayout() {
  const theme = useEnvironmentStore(selectTheme);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="min-h-screen relative" data-theme={theme}>
      {/* Atmospheric background */}
      <ShaderContainer theme={theme} />

      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[1] pointer-events-none"
        aria-hidden="true"
      />

      {/* App shell */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation isOffline={isOffline} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1500px] mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--surface-2)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
            fontFamily: "Geist, sans-serif",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}

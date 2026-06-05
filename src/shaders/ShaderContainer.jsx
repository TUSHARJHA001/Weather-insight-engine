import { lazy, Suspense } from "react";

const WeatherShader = lazy(() => import("./WeatherShader.jsx"));

export default function ShaderContainer({ theme }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--shader-back)",
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      }
    >
      <WeatherShader theme={theme} />
    </Suspense>
  );
}

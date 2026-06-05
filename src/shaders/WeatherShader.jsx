import { useEffect, useRef, memo } from "react";
import { getShaderConfig, hexToRgb } from "./ShaderThemeEngine.js";

const WeatherShader = memo(({ theme }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const configRef = useRef(getShaderConfig(theme));

  useEffect(() => {
    configRef.current = getShaderConfig(theme);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    let time = 0;
    let running = true;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      const cfg = configRef.current;
      particles = Array.from({ length: cfg.particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * cfg.speed * 0.5,
        vy: Math.random() * cfg.speed * 0.3 + cfg.speed * 0.1,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      }));
    }

    function draw() {
      if (!running) return;
      const cfg = configRef.current;
      time += 0.01 * cfg.speed;

      const [r1, g1, b1] = hexToRgb(cfg.colorBack);
      const [r2, g2, b2] = hexToRgb(cfg.colorFront);

      // Background gradient
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, `rgba(${r1 * 255},${g1 * 255},${b1 * 255},1)`);
      grd.addColorStop(
        1,
        `rgba(${r1 * 255 * 0.5},${g1 * 255 * 0.5},${b1 * 255 * 0.5},1)`,
      );
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric glow
      const cx = width * 0.5 + Math.sin(time * 0.3) * width * 0.1;
      const cy = height * 0.3 + Math.cos(time * 0.2) * height * 0.05;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.6);
      glow.addColorStop(
        0,
        `rgba(${r2 * 255},${g2 * 255},${b2 * 255},${cfg.intensity * 0.18})`,
      );
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const baseY = height * (0.55 + layer * 0.15);
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= width; x += 4) {
          const y =
            baseY +
            Math.sin(x * 0.008 + time + layer * 1.5) *
              height *
              cfg.waveAmp *
              0.08;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(${r2 * 255},${g2 * 255},${b2 * 255},${(0.04 - layer * 0.01) * cfg.intensity})`;
        ctx.fill();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy * cfg.speed;
        if (p.y > height + 5) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r2 * 255},${g2 * 255},${b2 * 255},${p.alpha * cfg.intensity})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        if (animRef.current) cancelAnimationFrame(animRef.current);
      } else {
        running = true;
        draw();
      }
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    draw();

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
      aria-hidden="true"
    />
  );
});

WeatherShader.displayName = "WeatherShader";
export default WeatherShader;

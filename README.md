# WeatherIQ — WeatherApp

A professional-grade environmental intelligence platform built with React, Vite, and the OpenWeatherMap API.

## Features

- **Dashboard** — Real-time weather with health score, severity status, AQI, alerts, and insights
- **Analytics** — Multi-chart weather trends (temperature, humidity, wind, pressure, rain, comfort)
- **Compare** — Side-by-side city comparison with radar chart and metric diffs
- **Saved Locations** — Pin, reorder, and quick-load your favourite cities
- **Voice Search** — Web Speech API powered city search
- **PWA** — Offline support with IndexedDB caching
- **Atmospheric Shader** — Canvas-based reactive weather background

## Tech Stack

React 18 · Vite · TailwindCSS · Framer Motion · Recharts · Zustand · Sonner · Axios · idb

## Setup

### 1. Get an API Key

Sign up at [openweathermap.org](https://openweathermap.org/api) for a free API key.

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_OPENWEATHER_API_KEY=your_key_here
```

> **Note:** The project ships with a demo key that may be rate-limited. For production use, replace it with your own key.

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Build

```bash
npm run build
npm run preview
```

## Architecture

```
src/
  app/          — Router, layout providers
  pages/        — Dashboard, Analytics, Compare, SavedLocations
  widgets/      — Feature-specific UI blocks
  features/     — Reusable feature components
  entities/     — Domain models
  engines/      — Business logic (score, severity, AQI, alerts, insights)
  shaders/      — Canvas atmospheric background system
  store/        — Zustand stores (weather, saved, settings, environment)
  shared/       — Components, hooks, utils, services, constants
```

## Engines

| Engine               | Purpose                            |
| -------------------- | ---------------------------------- |
| `weatherScoreEngine` | 0-100 environmental health score   |
| `severityEngine`     | 7-level condition severity         |
| `airQualityEngine`   | AQI classification & health impact |
| `alertEngine`        | Deterministic weather alerts       |
| `insightEngine`      | Rule-based environmental insights  |

## Deployment

Deploy to [Vercel](https://vercel.com):

```bash
npm i -g vercel
vercel --prod
```

Set `VITE_OPENWEATHER_API_KEY` in Vercel's environment variables.

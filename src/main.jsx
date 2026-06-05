import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./shared/styles/globals.css";
import AppRouter from "./app/routes/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);

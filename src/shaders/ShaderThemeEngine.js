import { SHADER_PRESETS } from "./shaderPresets.js";

export function getShaderConfig(theme) {
  return SHADER_PRESETS[theme] || SHADER_PRESETS.clear;
}

export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export function lerpColor(colorA, colorB, t) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  return a.map((v, i) => v + (b[i] - v) * t);
}

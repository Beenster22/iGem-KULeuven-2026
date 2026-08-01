// Generated with Claude Sonnet 5 (Anthropic), 2026-07-26
// Purpose: fixed light/dark palettes (replacing the old free-form per-region
// color picker) and the CSS-variable application logic behind the dark
// mode toggle.
export type ThemeMode = "light" | "dark";

interface ThemeColors {
  pageBg: string;
  bodyBg: string;
  text: string;
  headerBg: string;
  headerText: string;
  footerBg: string;
  footerText: string;
  accent: string;
  logoCircleBg: string;
}

const CSS_VARS: Record<keyof ThemeColors, string> = {
  pageBg: "--color-page-bg",
  bodyBg: "--color-body-bg",
  text: "--color-text",
  headerBg: "--color-header-bg",
  headerText: "--color-header-text",
  footerBg: "--color-footer-bg",
  footerText: "--color-footer-text",
  accent: "--color-accent",
  logoCircleBg: "--color-logo-circle-bg",
};

const LIGHT_THEME: ThemeColors = {
  pageBg: "#EAF4F5",
  bodyBg: "#C9BDE8",
  text: "#33283F",
  headerBg: "#33283F",
  headerText: "#EAF4F5",
  footerBg: "#33283F",
  footerText: "#C9BDE8",
  accent: "#C9BDE8",
  logoCircleBg: "#C9BDE8",
};

// A genuine dark theme: page-bg is a deep near-black purple (darker than any
// existing swatch, but derived from Dark Purple) so the body/card — which
// keeps the existing Dark Purple swatch — reads as an elevated surface on
// top of it, the way GitHub/Discord-style dark themes separate surfaces.
const DARK_THEME: ThemeColors = {
  pageBg: "#221b2b",
  bodyBg: "#33283F",
  text: "#EAF4F5",
  headerBg: "#2FA4A9",
  headerText: "#33283F",
  footerBg: "#C9BDE8",
  footerText: "#33283F",
  accent: "#C9BDE8",
  logoCircleBg: "#33283F",
};

const THEME_MODE_STORAGE_KEY = "empower-theme-mode";

export function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function readStoredThemeMode(): ThemeMode | null {
  try {
    const raw = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  } catch {
    // Storage may be unavailable (e.g. disabled/private browsing) — the
    // toggle still works for the session, it just won't persist.
  }
}

export function applyThemeMode(mode: ThemeMode) {
  const colors = mode === "dark" ? DARK_THEME : LIGHT_THEME;
  (Object.keys(colors) as (keyof ThemeColors)[]).forEach((key) => {
    document.documentElement.style.setProperty(CSS_VARS[key], colors[key]);
  });
  document.documentElement.setAttribute("data-theme", mode);
}

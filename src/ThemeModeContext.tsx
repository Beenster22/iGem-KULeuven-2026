// Generated with Claude Sonnet 5 (Anthropic), 2026-07-26
// Purpose: shares the current light/dark mode (and a toggle function)
// between Navbar and Footer without prop-drilling through Routes.
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  applyThemeMode,
  getSystemPrefersDark,
  readStoredThemeMode,
  ThemeMode,
  writeStoredThemeMode,
} from "./theme";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    () => readStoredThemeMode() ?? (getSystemPrefersDark() ? "dark" : "light"),
  );

  useEffect(() => {
    applyThemeMode(mode);
  }, [mode]);

  // Follow the OS-level preference live, but only until the user makes an
  // explicit choice via the toggle (see toggleMode, which persists a pick).
  useEffect(() => {
    if (readStoredThemeMode() !== null) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) =>
      setMode(event.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      writeStoredThemeMode(next);
      return next;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
}

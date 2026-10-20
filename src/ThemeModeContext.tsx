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
  // Dark is the default; only an explicit toggle pick (persisted) overrides it.
  const [mode, setMode] = useState<ThemeMode>(
    () => readStoredThemeMode() ?? "dark",
  );

  useEffect(() => {
    applyThemeMode(mode);
  }, [mode]);

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

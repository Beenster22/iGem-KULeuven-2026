import { useEffect, useState } from "react";
import {
  applyTheme,
  readStoredTheme,
  THEME_REGIONS,
  THEME_STORAGE_KEY,
} from "../theme";

const PALETTE = [
  { name: "Teal", hex: "#2FA4A9" },
  { name: "Lavender", hex: "#C9BDE8" },
  { name: "Pink", hex: "#F1C3D4" },
  { name: "Light Blue", hex: "#EAF4F5" },
  { name: "Dark Purple", hex: "#33283F" },
];

export function ThemeCustomizer() {
  const [theme, setTheme] = useState<Record<string, string>>(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const setRegionColor = (key: string, hex: string) => {
    setTheme((prev) => ({ ...prev, [key]: hex }));
  };

  const reset = () => setTheme({});

  return (
    <div className="bd-callout bd-callout-warning">
      <h4>Site Theme Customizer (temporary — remove before wiki freeze)</h4>
      <p>
        Pick a palette colour for each part of the site. Changes apply
        instantly across the whole wiki — navbar, header, page background,
        and footer — and persist while you browse, so the team can compare
        combinations on real pages.
      </p>
      {THEME_REGIONS.map((region) => {
        const selectedHex = theme[region.key] || region.default;
        return (
          <div className="mb-3" key={region.key}>
            <strong>{region.label}</strong>
            <div className="d-flex gap-2 mt-2">
              {PALETTE.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  title={`${color.name} (${color.hex})`}
                  aria-label={`Set ${region.label.toLowerCase()} to ${color.name}`}
                  onClick={() => setRegionColor(region.key, color.hex)}
                  style={{
                    backgroundColor: color.hex,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border:
                      selectedHex === color.hex
                        ? "3px solid #33283F"
                        : "1px solid rgba(0, 0, 0, 0.15)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={reset}
      >
        Reset to defaults
      </button>
    </div>
  );
}

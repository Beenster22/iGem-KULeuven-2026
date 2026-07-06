export interface ThemeRegion {
  key: string;
  label: string;
  cssVar: string;
  default: string;
}

export const THEME_REGIONS: ThemeRegion[] = [
  {
    key: "pageBg",
    label: "Page background (sides & navbar)",
    cssVar: "--color-page-bg",
    default: "#EAF4F5",
  },
  {
    key: "bodyBg",
    label: "Body background (content card)",
    cssVar: "--color-body-bg",
    default: "#C9BDE8",
  },
  {
    key: "text",
    label: "General text",
    cssVar: "--color-text",
    default: "#33283F",
  },
  {
    key: "headerBg",
    label: "Header background",
    cssVar: "--color-header-bg",
    default: "#33283F",
  },
  {
    key: "headerText",
    label: "Header text",
    cssVar: "--color-header-text",
    default: "#EAF4F5",
  },
  {
    key: "footerBg",
    label: "Footer background",
    cssVar: "--color-footer-bg",
    default: "#33283F",
  },
  {
    key: "footerText",
    label: "Footer text",
    cssVar: "--color-footer-text",
    default: "#C9BDE8",
  },
  {
    key: "accent",
    label: "Accent (hover highlights)",
    cssVar: "--color-accent",
    default: "#C9BDE8",
  },
];

export const THEME_STORAGE_KEY = "empower-theme-preview";

export function readStoredTheme(): Record<string, string> {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function applyTheme(theme: Record<string, string>) {
  THEME_REGIONS.forEach((region) => {
    document.documentElement.style.setProperty(
      region.cssVar,
      theme[region.key] || region.default,
    );
  });
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ACCENTS, pal, type AccentName, type Palette, type Theme } from "./tokens";

type ThemeContextValue = {
  theme: Theme;
  accent: AccentName;
  palette: Palette;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setAccent: (a: AccentName) => void;
  cycleAccent: () => void;
};

const THEME_KEY = "berliner-theme";
const ACCENT_KEY = "berliner-accent";

// Couleur de marque fixée à rouge (plus de sélecteur de couleurs).
const DEFAULTS = { theme: "dark" as Theme, accent: "red" as AccentName };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULTS.theme);
  const [accent, setAccentState] = useState<AccentName>(DEFAULTS.accent);

  // Hydrate from localStorage after mount (the inline <script> in
  // RootLayout has already applied the right `dark` class to <html> so
  // the first paint matches; this just syncs React state.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const t = window.localStorage.getItem(THEME_KEY);
      if (t === "light" || t === "dark") setThemeState(t);
      // L'accent est figé à rouge — on ne lit plus de couleur stockée.
    } catch {
      // localStorage unavailable — fall back to defaults.
    }
  }, []);

  // Reflect changes to <html> so global CSS variables resolve correctly.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.accent = accent;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
      window.localStorage.setItem(ACCENT_KEY, accent);
    } catch {
      // ignore quota / private mode
    }
  }, [theme, accent]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );
  const setAccent = useCallback((a: AccentName) => setAccentState(a), []);
  const cycleAccent = useCallback(() => {
    setAccentState((a) => {
      const i = ACCENTS.indexOf(a);
      return ACCENTS[(i + 1) % ACCENTS.length];
    });
  }, []);

  const palette = useMemo(() => pal(theme, accent), [theme, accent]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, accent, palette, setTheme, toggleTheme, setAccent, cycleAccent }),
    [theme, accent, palette, setTheme, toggleTheme, setAccent, cycleAccent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

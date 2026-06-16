// Design tokens — Berliner mobile UI (student + teacher).
// Inline-ready values (used by `pal()` for inline-style React components),
// with a CSS-variable companion exposed via `globals.css`.

export type Theme = "light" | "dark";

export type AccentName =
  | "green"
  | "blue"
  | "orange"
  | "violet"
  | "lemon"
  | "slate"
  | "red";

export const ACCENTS: AccentName[] = [
  "green",
  "blue",
  "orange",
  "violet",
  "lemon",
  "slate",
  "red",
];

const LIGHT = {
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  surface2: "#F4F3EE",
  border: "rgba(15,15,17,0.08)",
  borderStrong: "rgba(15,15,17,0.14)",
  ink: "#0E0E0F",
  ink2: "#3A3A3D",
  ink3: "#7A7A80",
  ink4: "#B5B5BA",
  chip: "#EFEEE9",
  overlay: "rgba(15,15,17,0.04)",
} as const;

const DARK = {
  bg: "#0E0E10",
  surface: "#16161A",
  surface2: "#1D1D22",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  ink: "#F5F5F2",
  ink2: "#C7C7CC",
  ink3: "#8A8A92",
  ink4: "#5A5A62",
  chip: "#23232A",
  overlay: "rgba(255,255,255,0.04)",
} as const;

const ACCENT_DEFS: Record<AccentName, { c: string; soft: string; ink: string }> = {
  green: {
    c: "oklch(0.72 0.16 145)",
    soft: "oklch(0.72 0.16 145 / 0.18)",
    ink: "oklch(0.32 0.06 145)",
  },
  blue: {
    c: "oklch(0.66 0.18 250)",
    soft: "oklch(0.66 0.18 250 / 0.18)",
    ink: "oklch(0.32 0.08 250)",
  },
  orange: {
    c: "oklch(0.72 0.18 50)",
    soft: "oklch(0.72 0.18 50 / 0.18)",
    ink: "oklch(0.34 0.08 50)",
  },
  violet: {
    c: "oklch(0.66 0.20 305)",
    soft: "oklch(0.66 0.20 305 / 0.18)",
    ink: "oklch(0.32 0.08 305)",
  },
  lemon: {
    c: "oklch(0.86 0.18 105)",
    soft: "oklch(0.86 0.18 105 / 0.20)",
    ink: "oklch(0.32 0.08 105)",
  },
  slate: {
    c: "#c3cdff",
    soft: "#c3cdff20",
    ink: "oklch(0.32 0.04 260)",
  },
  red: {
    c: "oklch(0.66 0.22 15)",
    soft: "oklch(0.66 0.22 15 / 0.18)",
    ink: "oklch(0.32 0.08 15)",
  },
};

export const SEM = {
  ok: "oklch(0.72 0.16 145)",
  warn: "oklch(0.78 0.16 75)",
  bad: "oklch(0.66 0.20 25)",
  info: "oklch(0.66 0.16 250)",
} as const;

export const FONT = {
  sans: '"Geist", -apple-system, "SF Pro Text", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace',
} as const;

export type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  borderStrong: string;
  ink: string;
  ink2: string;
  ink3: string;
  ink4: string;
  chip: string;
  overlay: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  dark: boolean;
  font: typeof FONT;
  sem: typeof SEM;
};

export function pal(theme: Theme, accent: AccentName): Palette {
  const base = theme === "dark" ? DARK : LIGHT;
  const a = ACCENT_DEFS[accent] ?? ACCENT_DEFS.green;
  return {
    ...base,
    accent: a.c,
    accentSoft: a.soft,
    accentInk: a.ink,
    dark: theme === "dark",
    font: FONT,
    sem: SEM,
  };
}

// Subject color helper — each subject can have a "color name"
// (red/green/blue/...) rather than a hex; map to accents.
// Falls back to the active accent.
export function colorFor(p: Palette, name?: string | null): string {
  if (!name) return p.accent;
  const k = name.toLowerCase() as AccentName;
  return ACCENT_DEFS[k]?.c ?? p.accent;
}

// Version sans palette : renvoie la couleur CSS d'une matière à partir de
// son nom de couleur (green/blue/...). Sert aux composants en Tailwind qui
// ont juste besoin d'une couleur dynamique pour une barre/un point. Repli
// sur la couleur primaire du thème.
export function subjectColor(name?: string | null): string {
  if (!name) return "var(--primary)";
  const def = ACCENT_DEFS[name.toLowerCase() as AccentName];
  return def?.c ?? "var(--primary)";
}

// SVG Bayer dither — usage as background-image. Returns a `url("...")`
// string suitable for inline `backgroundImage`.
export function ditherUrl(
  opts: { size?: number; fg?: string; alpha?: number; threshold?: number } = {}
): string {
  const { size = 2, fg = "#000", alpha = 0.5, threshold = 8 } = opts;
  const bayer = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  let rects = "";
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (bayer[y][x] < threshold) {
        rects += `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${fg}" fill-opacity="${alpha}"/>`;
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${4 * size}" height="${4 * size}">${rects}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export function ditherGradient(opts: { fg?: string; alpha?: number } = {}) {
  const { fg = "#000", alpha = 0.6 } = opts;
  return {
    backgroundImage: [
      ditherUrl({ size: 2, fg, alpha, threshold: 14 }),
      ditherUrl({ size: 2, fg, alpha: alpha * 0.6, threshold: 8 }),
      ditherUrl({ size: 2, fg, alpha: alpha * 0.3, threshold: 4 }),
    ].join(","),
    backgroundSize: "8px 8px, 8px 8px, 8px 8px",
    backgroundPosition: "0 0, 4px 4px, 2px 2px",
  } as const;
}

// Date helpers shared by the planning + grades pages.

/** YYYY-MM-DD in local time (avoid UTC drift from `toISOString().slice(0,10)`). */
export function localISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "T1" (Sep–Dec) / "T2" (Jan–Mar) / "T3" (Apr–Aug). */
export function termFromDate(iso: string | null | undefined): "T1" | "T2" | "T3" {
  if (!iso) return "T2";
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  if (m >= 9 && m <= 12) return "T1";
  if (m >= 1 && m <= 3) return "T2";
  return "T3";
}

/** "2025/26" academic year label. */
export function academicYearLabel(now = new Date()): string {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const start = m >= 9 ? y : y - 1;
  return `${start}/${String(start + 1).slice(2)}`;
}

/** ISO 8601 week number for a given local date. */
export function isoWeekNumber(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const ys = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - ys.getTime()) / 86400000 + 1) / 7);
}

/** Human-readable due date — "AUJ", "DEMAIN", "DANS 3J", "RETARD". */
export function relDue(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return "—";
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `RETARD ${Math.abs(diff)}J`;
  if (diff === 0) return "AUJ";
  if (diff === 1) return "DEMAIN";
  if (diff < 7) return `DANS ${diff}J`;
  if (diff < 14) return "+1 SEM";
  return `+${Math.floor(diff / 7)} SEM`;
}

export const APP_VERSION = "v1.0";
export const APP_BUILD = "2604";

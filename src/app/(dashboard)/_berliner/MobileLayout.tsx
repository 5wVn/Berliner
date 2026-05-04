"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BottomNav } from "@/shared/components/layouts/BottomNav";
import type { UserRole } from "@/shared/types/auth";
import { useTheme } from "@/shared/design/ThemeProvider";
import { UnicornBackground } from "@/shared/components/berliner/UnicornBackground";

/**
 * Page wrapper used by every Berliner mobile route. Provides:
 *   - background that matches the active theme (transparent in dark mode
 *     so the Unicorn Studio shader bleeds through; opaque in light mode)
 *   - reserved bottom padding for the fixed nav
 *   - the BottomNav itself (5 tabs for student/teacher)
 *   - the animated Unicorn Studio shader fixed behind everything in dark
 *
 * The page content is expected to be a `PageShell` and its children fill
 * the available height (overflow handled by inner ScrollFade containers).
 */
export function MobileLayout({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { palette: p, theme } = useTheme();
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: theme === "dark" ? "transparent" : p.bg,
        color: p.ink,
        position: "relative",
      }}
    >
      <UnicornBackground />
      <ViewportDebug />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          // Respect the notch on PWA / iPhone, with a 12px minimum so the
          // header kicker never hugs the top edge in regular browsers.
          paddingTop: "max(env(safe-area-inset-top), 12px)",
          paddingBottom:
            "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </div>
      <BottomNav role={role} />
    </div>
  );
}

// TEMP — diagnostic overlay to figure out why the iOS PWA renders a
// solid black band behind the status bar. Reads what the device reports
// for innerHeight, screen height, safe-area inset, and standalone mode.
// Remove once the root cause is identified.
function ViewportDebug() {
  const [info, setInfo] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      document.documentElement.style.setProperty(
        "--debug-sat",
        "env(safe-area-inset-top)"
      );
      const sat = cs.getPropertyValue("--debug-sat").trim();
      const w = window as unknown as { navigator: Navigator & { standalone?: boolean } };
      setInfo({
        innerH: String(window.innerHeight),
        screenH: String(window.screen.height),
        visualH: String(window.visualViewport?.height ?? "?"),
        sat,
        standalone: String(w.navigator.standalone ?? "?"),
        match: window.innerHeight === window.screen.height ? "YES" : "no",
      });
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        background: "rgba(255,0,0,0.85)",
        color: "white",
        font: "11px/1.3 monospace",
        padding: "4px 6px",
        pointerEvents: "none",
        whiteSpace: "pre",
      }}
    >
      {Object.entries(info)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}
    </div>
  );
}

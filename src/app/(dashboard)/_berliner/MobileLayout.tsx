"use client";

import type { ReactNode } from "react";
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
 * Note: on iOS 26.1 PWAs render with an opaque status bar band at the top
 * regardless of `apple-mobile-web-app-status-bar-style: black-translucent`
 * — this is a known Apple regression (works in 26.0, broken in 26.1
 * portrait). Nothing to fix on our side; will resolve when Apple ships
 * the patch.
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

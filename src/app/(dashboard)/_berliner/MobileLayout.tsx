"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/shared/components/layouts/BottomNav";
import type { UserRole } from "@/shared/types/auth";
import { useTheme } from "@/shared/design/ThemeProvider";

/**
 * Page wrapper used by every Berliner mobile route. Provides:
 *   - background that matches the active theme
 *   - reserved bottom padding for the fixed nav
 *   - the BottomNav itself (5 tabs for student/teacher)
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
  const { palette: p } = useTheme();
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: p.bg,
        color: p.ink,
        position: "relative",
      }}
    >
      <div
        style={{
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

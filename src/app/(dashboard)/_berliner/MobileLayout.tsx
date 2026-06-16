"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/shared/components/layouts/BottomNav";
import type { UserRole } from "@/shared/types/auth";
import { useTheme } from "@/shared/design/ThemeProvider";
import { UnicornBackground } from "@/shared/components/berliner/UnicornBackground";

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
  const pathname = usePathname();
  // Le fond animé s'affiche partout SAUF sur la page réglages (profil).
  const showBackground = !pathname?.endsWith("/profile");
  return (
    <div
      style={{
        minHeight: "100dvh",
        // Fond transparent : l'animation Unicorn (fixe, derrière) doit
        // apparaître à travers les zones sans carte.
        color: p.ink,
        position: "relative",
      }}
    >
      {showBackground && <UnicornBackground />}
      <div
        style={{
          position: "relative",
          zIndex: 10,
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

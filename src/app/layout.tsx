import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { ThemeProvider } from "@/shared/design/ThemeProvider";
import { cn } from "@/lib/utils";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Heading font shares the same Geist face — globals.css references
// --font-heading for the other roles' h1/h2 styling.
const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Berliner - Portail Etudiant",
  description: "Portail etudiant multi-etablissements, mobile-first.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    // black-translucent makes the iOS status bar overlay the page content
    // (instead of a solid bar), so the Unicorn shader renders all the way
    // to the very top of the screen in standalone / PWA mode.
    statusBarStyle: "black-translucent",
    title: "Berliner",
  },
  // Next.js's appleWebApp.capable only emits the modern generic
  // `mobile-web-app-capable`. Older iOS PWA installs (and some WKWebView
  // versions) still need the apple-prefixed tag to enter true standalone
  // mode and apply the status-bar-style. Set it explicitly here.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // viewportFit:cover lets the page extend under the iPhone notch / home
  // indicator. Combined with the mobile pages' max(env(safe-area-inset-*),
  // …) padding, the Unicorn shader renders all the way to the edges.
  viewportFit: "cover",
  themeColor: "#0E0E10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inline pre-hydration script: read theme + accent from localStorage
  // and apply them to <html> before React mounts so the first paint is
  // already correct (no flash of mismatched theme).
  const themeScript = `
(() => {
  try {
    const tk = "berliner-theme";
    const ak = "berliner-accent";
    const stored = localStorage.getItem(tk);
    const theme = stored === "light" ? "light" : "dark";
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    const accent = localStorage.getItem(ak);
    const valid = ["green","blue","orange","violet","lemon","slate","red"];
    root.dataset.accent = valid.indexOf(accent) >= 0 ? accent : "red";
  } catch (e) {}
})();
  `;

  return (
    <html
      lang="fr"
      className={cn(
        "dark",
        geistSans.variable,
        geistMono.variable,
        geistHeading.variable,
        "font-sans"
      )}
      data-accent="red"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

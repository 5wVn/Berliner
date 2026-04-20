import type { Metadata, Viewport } from "next";
import { Roboto_Slab, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({ subsets: ["latin"], variable: "--font-heading" });

const robotoSlab = Roboto_Slab({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Berliner - Portail Etudiant",
  description: "Portail etudiant multi-etablissements, mobile-first.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Berliner",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
(() => {
  try {
    const key = "berliner-theme";
    const stored = localStorage.getItem(key);
    const theme = stored === "light" ? "light" : "dark";
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  } catch {}
})();
  `;

  return (
    <html
      lang="fr"
      className={cn("dark", robotoSlab.variable, outfitHeading.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

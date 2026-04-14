import type { Metadata, Viewport } from "next";
import { Fira_Sans, Montserrat, Roboto, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const outfitHeading = Outfit({subsets:['latin'],variable:'--font-heading'});

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const firaSans = Fira_Sans({
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fira",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

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
  themeColor: "#4F46E5",
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
    const theme = stored === "dark" ? "dark" : "light";
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
    <html lang="fr" className={cn(firaSans.variable, montserrat.variable, "font-sans", roboto.variable, outfitHeading.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AuthProvider>
          {children}
          <ThemeToggle className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6" />
        </AuthProvider>
      </body>
    </html>
  );
}

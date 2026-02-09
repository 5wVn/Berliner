import type { Metadata, Viewport } from "next";
import { Belanosima } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/shared/providers/AuthProvider";

const belanosima = Belanosima({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-belanosima",
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
  return (
    <html lang="fr" className={`${belanosima.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

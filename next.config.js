const runtimeCaching = require("next-pwa/cache");
const path = require("path");

const withPWA = require("next-pwa")({
  dest: "public",
  // PWA désactivé pour l'instant : next-pwa@5.6 est incompatible avec le moteur
  // de build de Next 15 (erreur webpack au pré-rendu). Repasser à
  // `process.env.NODE_ENV === "development"` (ou migrer vers @ducanh2912/next-pwa)
  // pour le réactiver.
  disable: true,
  register: true,
  skipWaiting: true,
  runtimeCaching
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Prevent Next.js from inferring an incorrect workspace root when parent
  // directories contain lockfiles (common on local machines).
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          { key: "X-DNS-Prefetch-Control", value: "off" }
        ]
      }
    ];
  }
};

module.exports = withPWA(nextConfig);

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-belanosima)", "sans-serif"],
      },
      colors: {
        // Brand Primary (Indigo)
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5", // Brand Primary
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        // Brand Surface (Dark Navy) is Slate 900
        // We use default Tailwind Slate for Neutrals
        slate: {
          50: "#F8FAFC", // Background
          100: "#F1F5F9",
          200: "#E2E8F0", // Border
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B", // Text Secondary
          600: "#475569",
          700: "#334155",
          800: "#1E293B", // Text Primary
          900: "#0F172A", // Brand Surface
          950: "#020617",
        },
        // Semantic Colors
        success: {
          500: "#10B981", // Emerald 500
          50: "#ECFDF5",
        },
        warning: {
          500: "#F59E0B", // Amber 500
          50: "#FFFBEB",
        },
        error: {
          500: "#EF4444", // Red 500
          50: "#FEF2F2",
        },
        info: {
          500: "#3B82F6", // Blue 500
          50: "#EFF6FF",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
      fontSize: {
        // Base size bump to 17px as requested
        base: ["17px", "26px"],
      },
    },
  },
  plugins: [],
};
export default config;

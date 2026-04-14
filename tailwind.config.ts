import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-fira)", "sans-serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
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
        // Brand Surface (Zinc)
        // We use Zinc for a more neutral grey (less blue than Slate)
        slate: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
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
        // Accents (New for "More Colors")
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488", // Accessible text on white
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed", // Accessible text on white
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48", // Accessible text on white
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "40px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "glow-indigo": "0 0 15px 1px rgba(79, 70, 229, 0.6)", // Original dark glow
        "glow-indigo-soft":
          "0 8px 20px -12px rgba(79, 70, 229, 0.45), 0 0 12px rgba(79, 70, 229, 0.2)", // Softer glow for light surfaces
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

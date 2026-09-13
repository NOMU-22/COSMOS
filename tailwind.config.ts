import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07070b",
        surface: {
          DEFAULT: "rgba(16, 16, 26, 0.7)",
          light: "rgba(25, 25, 40, 0.8)",
          hover: "rgba(32, 30, 52, 0.9)",
          solid: "#0e0e18",
        },
        cosmos: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        cyber: {
          blue: "#38bdf8",
          pink: "#ec4899",
          amber: "#f59e0b",
          emerald: "#10b981",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cosmos-glow": "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.25) 0%, rgba(7, 7, 11, 0) 70%)",
        "liquid-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)",
        "liquid-primary": "linear-gradient(135deg, rgba(139, 92, 246, 0.45) 0%, rgba(124, 58, 237, 0.25) 100%)",
        "liquid-secondary": "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        "liquid-glow": "0 0 25px rgba(139, 92, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
        "liquid-hover": "0 0 35px rgba(139, 92, 246, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.6)",
        "glass-card": "0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "cyber-blue": "0 0 20px rgba(56, 189, 248, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "glow-fade": "glowFade 3s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowFade: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

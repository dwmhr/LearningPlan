import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#e0ebff",
          200: "#c2d7ff",
          400: "#4d84f5",
          500: "#2f6bf0",
          600: "#1d54e0",
          700: "#1642b0",
          900: "#0f1f4d",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 20px 60px -15px rgba(20, 40, 100, 0.25)",
        soft: "0 8px 24px -8px rgba(20, 40, 100, 0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;

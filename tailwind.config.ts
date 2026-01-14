import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          blue: "#3b82f6",
          indigo: "#6366f1",
          slate: "#0f172a",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;

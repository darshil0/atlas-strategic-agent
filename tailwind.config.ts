import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Outfit', 'ui-sans-serif', 'sans-serif'],
      },
      backdropBlur: {
        '3xl': '64px',
      },
      colors: {
        atlas: {
          blue: "#3b82f6",
          indigo: "#6366f1", 
          slate: "#0f172a",
        },
        glass: {
          1: 'rgba(255, 255, 255, 0.1)',
          2: 'rgba(255, 255, 255, 0.05)',
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.33)', opacity: '1' },
          '80%, 100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;

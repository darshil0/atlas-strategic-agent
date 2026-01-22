/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
        display: ['Outfit', 'ui-sans-serif'],
      },
      backdropBlur: {
        '3xl': '64px',
      },
      colors: {
        glass: {
          1: 'rgba(255, 255, 255, 0.1)',
          2: 'rgba(255, 255, 255, 0.05)',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

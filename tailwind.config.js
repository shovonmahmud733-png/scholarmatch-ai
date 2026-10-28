/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0a192f',
          dark: '#0f172a',
          primary: '#1e40af', // royal blue
          accent: '#0d9488',  // restrained teal
          accentLight: '#14b8a6',
          blueSoft: '#e0e7ff',
          tealSoft: '#ccfbf1',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

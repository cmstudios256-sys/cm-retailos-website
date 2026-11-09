/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./About.html",
    "./download.html",
    "./How to Setup.html",
    "./User Guide.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
  ],
  darkMode: ['selector', '[data-theme="light"]'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          950: '#031926'
        },
        retail: {
          bg: 'hsl(218 42% 7%)',
          'bg-deep': 'hsl(220 50% 5%)',
          card: 'hsl(217 38% 11%)',
          'card-2': 'hsl(217 34% 15%)',
          border: 'hsl(217 28% 20%)',
          'border-soft': 'hsl(217 28% 15%)',
          fg: 'hsl(210 25% 97%)',
          muted: 'hsl(215 20% 70%)',
          faint: 'hsl(215 16% 54%)'
        }
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
};

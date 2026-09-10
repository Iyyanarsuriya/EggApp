/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',    // Tablet
      'lg': '1025px',   // Desktop
      'xl': '1280px',   // Wide Desktop
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          dark: '#b45309',
          light: '#fef3c7',
          subtle: '#fffbeb',
        },
        secondary: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#ecfdf5',
        },
        dark: {
          DEFAULT: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
        page: '#fdfbf7',
        surface: '#ffffff',
        subtle: '#f8f6f0',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'lg': '0 20px 25px -5px rgba(245, 158, 11, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

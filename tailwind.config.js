/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0F766E',
        },
        accent: {
          green: '#10B981',
          orange: '#F97316',
          blue: '#3B82F6',
        },
        neutral: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            muted: '#9CA3AF',
          },
        },
        status: {
          estimated: '#D1D5DB',
          live: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}

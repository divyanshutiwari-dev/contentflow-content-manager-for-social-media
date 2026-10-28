/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--surface)',
        'surface-subtle': 'var(--surface-subtle)',
        'surface-hover': 'var(--surface-hover)',
        foreground: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        border: {
          DEFAULT: 'var(--border)',
          dark: 'var(--border-dark)',
        },
        primary: {
          DEFAULT: '#E5484D',
          hover: '#DC2626',
          light: '#FEECEE',
          dark: '#B91C1C',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
          dark: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
          dark: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 2px 6px 0 rgba(0, 0, 0, 0.03)',
        popover: '0 6px 24px -2px rgba(0, 0, 0, 0.2), 0 2px 8px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

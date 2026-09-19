/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saas: {
          lightBg: '#F7F8FA',
          lightCard: '#FFFFFF',
          lightBorder: '#E5E7EB',
          lightText: '#111827',
          lightMuted: '#6B7280',
          darkBg: '#111315',
          darkCard: '#191C1F',
          darkCardSecondary: '#202428',
          darkBorder: '#2D3135',
          darkText: '#F9FAFB',
          darkMuted: '#9CA3AF',
        },
        btc: {
          orange: '#F7931A',
          amber: '#F59E0B',
          softOrange: '#FFF7ED',
          darkOrange: '#C2710C',
        },
        status: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        'saas-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'saas-card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'saas-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'saas-dark-card': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8333B',
          hover:   '#C72030',
          light:   '#FFF1F2',
          dark:    '#A01C23',
        },
        page:   '#F5F6F8',
        card:   '#FFFFFF',
        score: {
          DEFAULT: '#059669',
          light:   '#ECFDF5',
        },
        star:   '#F59E0B',
        ink: {
          DEFAULT:   '#111827',
          secondary: '#6B7280',
          light:     '#9CA3AF',
        },
        line:   '#E5E7EB',
      },
      fontFamily: {
        brand: ['"Fraunces"', 'Georgia', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 16px 48px rgba(0,0,0,0.1)',
        search:       '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)',
        dropdown:     '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        modal:        '0 24px 64px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        shimmer:      'shimmer 1.6s linear infinite',
        'slide-up':   'slideUp 0.25s ease-out forwards',
        'fade-in':    'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

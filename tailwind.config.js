/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        cream: {
          50: '#fcfbf8',
          100: '#f7f4ed',
          200: '#eceae4',
          300: '#e0ddd5',
          400: '#d4d1c8',
        },
        charcoal: {
          50: '#f5f5f4',
          100: '#e8e8e7',
          200: '#c4c4c2',
          300: '#8f8f8d',
          400: '#5f5f5d',
          500: '#3a3a38',
          600: '#2a2a28',
          700: '#1c1c1c',
          800: '#161616',
          900: '#0e0e0e',
        },
        link: {
          400: '#3b82f6',
        },
      },
      boxShadow: {
        'btn-dark': 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px',
        'btn-dark-lg': 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.08) 0px 2px 8px 0px',
        'focus': 'rgba(0,0,0,0.08) 0px 4px 12px',
        'card-hover': 'rgba(0,0,0,0.06) 0px 4px 16px',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.15s ease-out both',
        shimmer: 'shimmer 1.5s infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

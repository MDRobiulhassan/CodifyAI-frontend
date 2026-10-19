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
        ink: {
          950: '#070A12',
          900: '#0B0F1A',
          850: '#0F1424',
          800: '#141A2E',
          700: '#1B2238',
          600: '#252E48',
          500: '#38436A',
          400: '#5A6790',
          300: '#8A95B8',
          200: '#B8C0DB',
          100: '#E2E7F4',
        },
        brand: {
          50: '#E9FFF6',
          100: '#C7FFE9',
          200: '#8BFBD3',
          300: '#4FF5BA',
          400: '#3EE6A8',
          500: '#1FD89A',
          600: '#12B07C',
          700: '#0E8C63',
          800: '#0C6E4F',
          900: '#0A5740',
        },
        accent: {
          400: '#7CF5C8',
          500: '#3EE6A8',
        },
        warn: {
          400: '#FFD166',
          500: '#F5B400',
        },
        danger: {
          400: '#FF6B81',
          500: '#F23D5A',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(62, 230, 168, 0.45)',
        'glow-sm': '0 0 20px -8px rgba(62, 230, 168, 0.4)',
        panel: '0 10px 40px -12px rgba(0,0,0,0.6)',
        card: '0 2px 14px -4px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(62,230,168,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(62,230,168,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(62,230,168,0.4)' },
        },
        blink: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-glow': 'pulse-glow 1.8s ease-out infinite',
        blink: 'blink 1s step-end infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};

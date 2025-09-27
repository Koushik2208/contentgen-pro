/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        'charcoal': '#121212',
        'electric-blue': '#1E90FF',
        'magenta': '#FF2D95',
        'dark-gray': '#1E1E1E',
        'medium-gray': '#2A2A2A',
        'light-gray': '#666666',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(30, 144, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(30, 144, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
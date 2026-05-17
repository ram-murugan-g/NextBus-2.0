/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        navy: { 900: '#060B18', 800: '#0A0E1A', 700: '#0F1629', 600: '#141E35' },
        glass: 'rgba(255,255,255,0.05)',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out both',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bounceDot: { '0%,80%,100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } }
      }
    }
  },
  plugins: []
};

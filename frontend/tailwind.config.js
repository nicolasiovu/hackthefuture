/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'gradient-start': '#121212', 
        'gradient-middle': '#181818', 
        'gradient-middle-2': '#1f1f1f', 
        'gradient-end': '#0a0a0a', 
      },
      keyframes: {
        smoothGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.1)' }, // Reduced scale for better performance
        },
        floatAround: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-30px) translateX(20px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
        floatDiagonal: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' }, // Reduced distance for better performance
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        smooth: 'smoothGradient 15s linear infinite',
        glow: 'glowPulse 5s ease-in-out infinite',
        glowFast: 'glowPulse 3s ease-in-out infinite',
        float: 'floatAround 12s ease-in-out infinite',
        floatSlow: 'floatAround 20s ease-in-out infinite',
        floatDiagonal: 'floatDiagonal 15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
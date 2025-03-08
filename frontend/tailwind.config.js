/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'gradient-start': '#121212', // Very dark start color
        'gradient-middle': '#1a1a1a', // Darker middle color
        'gradient-end': '#0a0a0a', // Almost black end color
      },
      keyframes: {
        waterRipple: {
          '0%': {
            backgroundPosition: '0% 0%',
          },
          '50%': {
            backgroundPosition: '100% 100%',
          },
          '100%': {
            backgroundPosition: '0% 0%',
          },
        },
        contentFloat: {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        }
      },
      animation: {
        water: 'waterRipple 20s ease-in-out infinite', // Background animation
        float: 'contentFloat 10s ease-in-out infinite', // Optional content float animation
      },
      zIndex: {
        '-1': '-1',
      }
    },
  },
  plugins: [],
}


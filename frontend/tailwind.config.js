/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'neumorphic': {
          'bg': '#e0e5ec',
          'text': '#2d3748',
          'primary': '#4a90e2',
          'secondary': '#718096',
          'accent': '#f56565'
        }
      },
      boxShadow: {
        'neumorphic': '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff',
        'neumorphic-inset': 'inset 9px 9px 16px #a3b1c6, inset -9px -9px 16px #ffffff',
        'neumorphic-pressed': 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}


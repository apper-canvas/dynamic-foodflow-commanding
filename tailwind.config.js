/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#FF6B35',
          600: '#ea580c',
          700: '#c2410c',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#2D3436',
          600: '#1e293b',
          700: '#0f172a',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#00B894',
          600: '#059669',
          700: '#047857',
        },
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#FF6B6B',
        info: '#74B9FF',
        surface: '#FFFFFF',
        background: '#F5F6FA',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-scale': 'bounceScale 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        bounceScale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
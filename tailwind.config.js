/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep medical navy — primary
        navy: {
          50: '#f0f4f9',
          100: '#dbe5f0',
          200: '#b9cce0',
          300: '#8da9c9',
          400: '#5b7ba3',
          500: '#355d86',
          600: '#1f4468',
          700: '#143356',
          800: '#0e2a47',
          900: '#0B2545',
          950: '#071a33',
        },
        // Elbrit brand red — primary accent (token name kept as "marine" for
        // continuity; values are the corporate Elbrit red).
        marine: {
          50: '#fdecec',
          100: '#fbd6d7',
          200: '#f6abae',
          300: '#ef7c80',
          400: '#e84a51',
          500: '#e11b22',
          600: '#c1141a',
          700: '#9e1015',
          800: '#820f14',
          900: '#6b1014',
        },
        // Calbrit 60K / HydroX brand blue
        azure: {
          50: '#ecf8fe',
          100: '#d2eefc',
          200: '#a6def9',
          300: '#6ecbf4',
          400: '#38b2e8',
          500: '#1f9fd6',
          600: '#1380b4',
          700: '#176a92',
          800: '#185777',
          900: '#184863',
        },
        // Calbrit "60K" badge amber
        amber60k: {
          400: '#fbab3a',
          500: '#f7941d',
          600: '#e07d10',
        },
        // Soft emerald — secondary accent
        sage: {
          50: '#edf6f1',
          100: '#d3e9dd',
          200: '#a8d4bd',
          300: '#74b896',
          400: '#469a6f',
          500: '#2E8B57',
          600: '#237046',
          700: '#1d5a39',
          800: '#194830',
          900: '#153c29',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 37, 69, 0.04), 0 10px 30px -16px rgba(11, 37, 69, 0.18)',
        'card-hover': '0 2px 4px rgba(11, 37, 69, 0.06), 0 18px 40px -18px rgba(11, 37, 69, 0.26)',
      },
      maxWidth: {
        content: '105rem',
      },
    },
  },
  plugins: [],
}

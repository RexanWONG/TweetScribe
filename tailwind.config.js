/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      'animation': {
        'text':'text 8s ease infinite',
      },
      'keyframes': {
          'text': {
              '0%, 100%': {
                'background-size':'200% 200%',
                  'background-position': 'left center'
              },
              '50%': {
                'background-size':'200% 200%',
                  'background-position': 'right center'
              }
          },
      }
    },
  },
  plugins: [],
}


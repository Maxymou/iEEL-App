/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apple-gray': '#F5F5F7',
        'apple-text': '#1D1D1F',
        'apple-text-secondary': '#6E6E73',
        'apple-blue': '#0071E3',
        'apple-border': '#D2D2D7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

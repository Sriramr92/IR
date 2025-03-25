/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hpe: {
          primary: '#01A982',
          secondary: '#425563',
          accent: '#00B5E2',
          warning: '#F5C400',
          danger: '#FF8D6D',
          purple: '#614767'
        }
      }
    },
  },
  plugins: [],
};
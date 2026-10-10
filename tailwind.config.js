/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'border-green-400',
    'border-blue-400',
    'from-green-500',
    'from-blue-500',
    'to-green-600',
    'to-blue-600',
    'shadow-green-100',
    'shadow-blue-100',
  ],
};

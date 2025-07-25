/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [require('@tailwindcss/line-clamp')],
}
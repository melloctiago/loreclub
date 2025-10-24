/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lore-purple': '#6104ef',
        'lore-purple-md': '#7e22f3',
        'lore-purple-lg': '#9c40f7',
        'lore-pink': '#b95dfb',
        'lore-pink-lg': '#d67bff',
        'lore-bg': '#1a1a2e',
        'lore-bg-light': '#1e1e3f',
        'lore-bg-card': '#2a2a4e',
        'lore-border': '#3a3a5e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#E65100', // Laranja que abre o apetite
        'brand-dark': '#121212',   // Fundo premium
        'brand-card': '#1E1E1E',   // Fundo dos cartões
      }
    },
  },
  plugins: [],
}
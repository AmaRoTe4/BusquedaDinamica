/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azul: "rgb(30 64 175)",
        naranja:"#FFA500",
        verde:"#7FFF00",
        rosa:"#FFC0CB",
        amarillo:"#FFFF00",
        turquesa:"#00CED1"
      },
    },
  },
  plugins: [],
}

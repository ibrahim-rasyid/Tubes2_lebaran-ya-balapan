/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",],
  theme: {
    extend: {
      fontFamily: {
        A: ["Archivo", "sans-serif"]
      }
    },
  },
  safelist: ['graph-wrapper'], 
  plugins: [],
}


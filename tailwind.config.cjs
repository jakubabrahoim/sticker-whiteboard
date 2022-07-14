/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "98": "96%",
        "2": "4%",
      }
    },
  },
  plugins: [],
}
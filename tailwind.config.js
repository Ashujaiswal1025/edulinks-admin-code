/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eduTheme: 'rgba(55,215,217,1)',
        eduThemeOP: 'rgba(55,215,217,0.15)',
        eduThemeOPL: 'rgba(55,215,217,0.32)',
        eduThemePhase: 'rgba(201, 208, 214, 0.35)',
        eduThemeCircle: 'rgba(8, 114, 116, 1)',
        eduThemeOption: 'rgba(0, 255, 94, 0.11)'
      },
      fontFamily: {
        robotoCondensed: ['"Roboto Condensed"', 'sans-serif'],
        adramalech: ['"Adramalech"', 'sans-serif']
      },
    },
  },
  plugins: [],
}


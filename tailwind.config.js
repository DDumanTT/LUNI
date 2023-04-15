/** @type {import('tailwindcss').Config} */
const { toRadixVars } = require('windy-radix-palette/vars');

module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        pressstart2p: ['PressStart2P', 'sans-serif'],
      },
      colors: {
        primary: toRadixVars('indigo'),
        secondary: toRadixVars('red'),
        neutral: toRadixVars('slate'),
        success: toRadixVars('grass'),
        warning: toRadixVars('yellow'),
        error: toRadixVars('tomato'),
        info: toRadixVars('cyan'),
      },
      transitionProperty: {
        size: 'width, height',
      },
    },
  },
  plugins: [require('windy-radix-palette'), require('prettier-plugin-tailwindcss')],
};

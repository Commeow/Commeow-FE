/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        mainlogo: "url('./assets/commeow.png')",
        defaultList: "url('./assets/defaultListImg.png')",
      },
      colors: {
        mainBlack: 'rgb(24,24,27)',
        headerBlack: 'rgba(0,0,0,0.2)',
        modalOuter: 'rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};

const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        Finn: "#50244A",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EFE3",
        ink: "#1F2D3D",
        teal: {
          DEFAULT: "#1B4B43",
          dark: "#123430",
        },
        saffron: {
          DEFAULT: "#D98E04",
          light: "#F2B33D",
        },
        border: "#DCD3C0",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

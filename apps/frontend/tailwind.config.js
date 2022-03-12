module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blurple: "#7289DA",
        darkBlurple: "#2c2f33",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

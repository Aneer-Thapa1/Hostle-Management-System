/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-bg": "url('./src/assets/landingBackground.svg')",
      },
      colors: {
        primaryColor: "#C39161",
        background: "#23262D",
        boxColor: "#323f49",
      },
    },
  },
  plugins: [],
};

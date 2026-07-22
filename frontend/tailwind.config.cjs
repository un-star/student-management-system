/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan the app source so Tailwind only emits the classes we actually use.
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1020",
        inklight: "#16213A",
        paper: "#F8FAFC",
        surface: "#FFFFFF",
        brass: "#D68B1F",
        success: "#1F7A57",
        danger: "#C6452D",
        info: "#275EFE",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

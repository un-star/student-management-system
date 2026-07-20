/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan the app source so Tailwind only emits the classes we actually use.
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101A2E",
        inklight: "#1C2B47",
        paper: "#EEF1F6",
        brass: "#C99A3E",
        success: "#2F7D5B",
        danger: "#B3452C",
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

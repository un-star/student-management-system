const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

// Keep Vite config minimal on Windows so the dev/build loader stays stable.
module.exports = defineConfig({
  plugins: [react()],
});

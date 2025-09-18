const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

// https://vite.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  define: {
    'process.env': {}
  }
});

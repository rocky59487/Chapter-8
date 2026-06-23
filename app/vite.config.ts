import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Relative base so the built app works both from a web server and when
// embedded inside a native (Capacitor/APK) WebView with a file:// origin.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { host: true, port: 5173 },
  build: {
    target: 'es2019',
    outDir: 'dist',
    sourcemap: false,
  },
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const proxy = {
    "/health": {
      target: backendUrl,
      changeOrigin: true,
    },
    "/api": {
      target: backendUrl,
      changeOrigin: true,
    },
    "/ws": {
      target: backendUrl,
      changeOrigin: true,
      ws: true,
    },
  };

  return {
    plugins: [react()],
    server: {
      proxy,
    },
    preview: {
      proxy,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            recharts: ["recharts"],
            leaflet: ["leaflet", "react-leaflet"],
          },
        },
      },
    },
  };
});

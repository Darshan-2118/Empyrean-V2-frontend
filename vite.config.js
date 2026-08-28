import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:8000";

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

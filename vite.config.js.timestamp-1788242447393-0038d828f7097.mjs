// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/Vyshali%20D%20D/OneDrive/Desktop/github/Empyrean-V2-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Vyshali%20D%20D/OneDrive/Desktop/github/Empyrean-V2-frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:8000";
  const proxy = {
    "/health": {
      target: backendUrl,
      changeOrigin: true
    },
    "/api": {
      target: backendUrl,
      changeOrigin: true
    },
    "/ws": {
      target: backendUrl,
      changeOrigin: true,
      ws: true
    }
  };
  return {
    plugins: [react()],
    server: {
      proxy
    },
    preview: {
      proxy
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            recharts: ["recharts"],
            leaflet: ["leaflet", "react-leaflet"]
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxWeXNoYWxpIEQgRFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXGdpdGh1YlxcXFxFbXB5cmVhbi1WMi1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVnlzaGFsaSBEIERcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxnaXRodWJcXFxcRW1weXJlYW4tVjItZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1Z5c2hhbGklMjBEJTIwRC9PbmVEcml2ZS9EZXNrdG9wL2dpdGh1Yi9FbXB5cmVhbi1WMi1mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xyXG4gIGNvbnN0IGJhY2tlbmRVcmwgPSBlbnYuVklURV9CQUNLRU5EX1VSTCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiO1xyXG5cclxuICBjb25zdCBwcm94eSA9IHtcclxuICAgIFwiL2hlYWx0aFwiOiB7XHJcbiAgICAgIHRhcmdldDogYmFja2VuZFVybCxcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgIHRhcmdldDogYmFja2VuZFVybCxcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIFwiL3dzXCI6IHtcclxuICAgICAgdGFyZ2V0OiBiYWNrZW5kVXJsLFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHdzOiB0cnVlLFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIHByb3h5LFxyXG4gICAgfSxcclxuICAgIHByZXZpZXc6IHtcclxuICAgICAgcHJveHksXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIHJlY2hhcnRzOiBbXCJyZWNoYXJ0c1wiXSxcclxuICAgICAgICAgICAgbGVhZmxldDogW1wibGVhZmxldFwiLCBcInJlYWN0LWxlYWZsZXRcIl0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVZLFNBQVMsY0FBYyxlQUFlO0FBQzdhLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsUUFBTSxhQUFhLElBQUksb0JBQW9CO0FBRTNDLFFBQU0sUUFBUTtBQUFBLElBQ1osV0FBVztBQUFBLE1BQ1QsUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLElBQ2hCO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLGNBQWM7QUFBQSxNQUNkLElBQUk7QUFBQSxJQUNOO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixRQUFRO0FBQUEsTUFDTjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFlBQ1osVUFBVSxDQUFDLFVBQVU7QUFBQSxZQUNyQixTQUFTLENBQUMsV0FBVyxlQUFlO0FBQUEsVUFDdEM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

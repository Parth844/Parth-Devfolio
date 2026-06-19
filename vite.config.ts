import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split the single giant bundle into logical vendor chunks. These download in
        // parallel and stay cached across deploys (your app code changes far more often
        // than three.js does), which is the real first-load win.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@react-three") || id.includes("/three/")) return "three-vendor";
          if (
            id.includes("framer-motion") ||
            id.includes("gsap") ||
            id.includes("lenis")
          )
            return "animation-vendor";
          if (id.includes("@radix-ui")) return "radix-vendor";
          if (
            id.includes("react-router") ||
            id.includes("react-dom") ||
            id.includes("/react/") ||
            id.includes("/scheduler/")
          )
            return "react-vendor";
          return "vendor";
        },
      },
    },
    // three.js is inherently large; its own chunk legitimately exceeds the default
    // 500 kB notice, so raise the threshold rather than chase a warning we can't fix.
    chunkSizeWarningLimit: 800,
  },
}));

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
          // Only libraries with no cross-chunk imports get their own chunk.
          // Splitting @react-three/* or react-router into separate chunks
          // creates circular chunks (they import React / @remix-run/router
          // living elsewhere), which breaks module init order in production
          // and renders a blank page.
          if (id.includes("/node_modules/three/")) return "three-vendor";
          if (id.includes("gsap") || id.includes("lenis")) return "animation-vendor";
          if (
            id.includes("react-dom") ||
            id.includes("/node_modules/react/") ||
            id.includes("/scheduler/")
          )
            return "react-vendor";
        },
      },
    },
    // three.js is inherently large; its own chunk legitimately exceeds the default
    // 500 kB notice, so raise the threshold rather than chase a warning we can't fix.
    chunkSizeWarningLimit: 800,
  },
}));

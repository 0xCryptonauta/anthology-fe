import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import { viteSingleFile } from "vite-plugin-singlefile";
import { VitePWA, type ManifestOptions } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

import manifest from "./src/manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  //base: "/anthology-fe/",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes(
              "node_modules/@walletconnect/ethereum-provider/dist/index.es.js"
            )
          ) {
            return "wc-ethereum-provider";
          }
          if (id.includes("node_modules/@walletconnect")) {
            return "walletconnect";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: "autoUpdate", // || prompt
      devOptions: {
        enabled: false,
      },
      includeAssets: ["/IB_icon.png", "/pwa-192x192.png", "/pwa-512x512.png"],
      manifest: manifest as ManifestOptions,
    }),
  ],

  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@abi": path.resolve(__dirname, "src/abi"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contract-functions": path.resolve(
        __dirname,
        "./src/contract-functions"
      ),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@store": path.resolve(__dirname, "src/store"),
      "@types": path.resolve(__dirname, "src/types"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@views": path.resolve(__dirname, "src/views"),
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import { viteSingleFile } from "vite-plugin-singlefile";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /* viteSingleFile(), */
    VitePWA({
      //registerType: "autoUpdate",

      devOptions: {
        enabled: false,
      },

      includeAssets: ["/IB_icon.png"],
      manifest: {
        name: "Anthology",
        short_name: "Memory",
        description: "Recording the collective memory",
        theme_color: "#242424",
        id: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        display: "standalone",
        display_override: ["window-controls-overlay"],
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
    }),
  ],
  //base: "/anthology-fe/",
  base: "/",
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@abi": path.resolve(__dirname, "src/abi"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contract-functions": path.resolve(
        __dirname,
        "./src/contract-functions"
      ),
      "@store": path.resolve(__dirname, "src/store"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@views": path.resolve(__dirname, "src/views"),
    },
  },
});

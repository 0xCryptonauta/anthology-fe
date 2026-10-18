import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          /*          if (id.includes("node_modules/@reown/appkit-wallet")) {
            return "reown-appkit-wallet";
          } */
          if (id.includes("node_modules/@remix-run/router/dist/router.js")) {
            return "remix-run-router";
          }
          if (id.includes("node_modules/react-dom")) {
            return "react-dom";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: "autoUpdate", // || prompt
      injectRegister: "script-defer",
      devOptions: {
        enabled: true,
        type: "module",
      },
      includeAssets: [
        "/IB_icon.png",
        "/IB_icon-60.png",
        "/pwa-192x192.png",
        "/pwa-512x512.png",
      ],
      manifest: manifest as ManifestOptions,

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,woff2,webp}"],
        navigateFallbackDenylist: [/^\/onboarding\.html/, /^\/og-image\.html/],
        ignoreURLParametersMatching: [/^lang$/, /^utm_/, /^fbclid$/],
        runtimeCaching: [
          {
            // Note: "script" is intentionally NOT cached here — caching Vite's
            // dev modules makes reloads serve stale code (and prod app scripts
            // are already covered by the workbox precache).
            urlPattern: ({ request }) =>
              request.destination === "style" ||
              request.destination === "font" ||
              request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname === "/" || url.pathname.endsWith("index.html"),
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
            },
          },
        ],
      },
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

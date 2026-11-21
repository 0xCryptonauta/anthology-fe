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
          // Web3 is opt-in: pin the WalletConnect provider's entry module to a
          // stable-named chunk so the service worker can keep it (and the
          // dependency subtree only it uses) out of the precache. Matching
          // only the provider entry — not the whole @walletconnect namespace —
          // leaves modules shared with the shell (e.g. abitype) where Rollup
          // put them, so the main entry never grows a static edge to this
          // chunk. It is only fetched when the user clicks connect.
          if (id.includes("node_modules/@walletconnect/ethereum-provider")) {
            return "walletconnect-vendor";
          }
          // abitype and Vite's preload-helper are shared by the entry graph
          // and the vendor graph. Without an explicit home, Rollup drops them
          // into the vendor chunk, which gives the entry a static import edge
          // to it — and a modulepreload that downloads wallet code at boot.
          // Keep them in their own small chunk that both sides import instead.
          if (
            id.includes("node_modules/abitype") ||
            id.includes("preload-helper")
          ) {
            return "shared-deps";
          }
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
        globPatterns: ["**/*.{js,css,html,woff2,webp,wasm}"],
        // Wallet code is opt-in and on-demand: neither the connector shim
        // nor the WalletConnect vendor chunk is precached, so local-only
        // users never download it. The runtime route below serves both
        // after the first connect click fetches them.
        globIgnores: [
          "**/walletconnect-vendor-*.js",
          "**/walletConnect-*.js",
        ],
        navigateFallbackDenylist: [/^\/onboarding\.html/, /^\/og-image\.html/],
        ignoreURLParametersMatching: [/^lang$/, /^utm_/, /^fbclid$/],
        runtimeCaching: [
          {
            // Web3 is opt-in — the connector shim and the WalletConnect
            // vendor chunk download on the first wallet-connect click and
            // are cached from then on. Never precached (see globIgnores
            // above).
            urlPattern: /\/assets\/(walletconnect-vendor|walletConnect)-[^/]+\.js$/,
            handler: "CacheFirst",
            options: {
              cacheName: "wc-vendor",
              expiration: {
                maxEntries: 4,
                purgeOnQuotaError: true,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          {
            // Note: "script" is intentionally NOT cached here — caching Vite's
            // dev modules makes reloads serve stale code (and prod app scripts
            // are already covered by the workbox precache).
            //
            // Same-origin only: cross-origin images are fetched without CORS
            // (opaque responses) and Chromium pads each cached opaque response
            // by 0–14 MB of quota (≈7 MB average), which made a 50-thumbnail
            // list report ~350 MB in navigator.storage.estimate(). Let the
            // browser HTTP cache handle third-party images instead.
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin &&
              (request.destination === "style" ||
                request.destination === "font" ||
                request.destination === "image"),
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                purgeOnQuotaError: true,
              },
              cacheableResponse: {
                // 0 means "opaque" — never cache those (see comment above).
                statuses: [200],
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

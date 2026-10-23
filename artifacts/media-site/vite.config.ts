import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;
const port = rawPort && !Number.isNaN(Number(rawPort)) ? Number(rawPort) : 5000;

const basePath = process.env.BASE_PATH ?? "/";

function getNodeModulePkg(id: string): string | null {
  const norm = id.replace(/\\/g, "/");
  const idx = norm.lastIndexOf("/node_modules/");
  if (idx === -1) return null;
  const rest = norm.slice(idx + "/node_modules/".length);
  if (rest.startsWith("@")) {
    const parts = rest.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : rest;
  }
  return rest.split("/")[0] ?? null;
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const pkg = getNodeModulePkg(id);
          if (!pkg) return undefined;

          if (
            pkg === "react" ||
            pkg === "react-dom" ||
            pkg === "scheduler" ||
            pkg === "use-sync-external-store" ||
            pkg === "wouter" ||
            pkg === "regexparam"
          ) {
            return "vendor-react";
          }

          if (pkg.startsWith("@tanstack/")) {
            return "vendor-query";
          }

          if (
            pkg.startsWith("@tiptap/") ||
            pkg.startsWith("prosemirror-") ||
            pkg === "orderedmap" ||
            pkg === "rope-sequence" ||
            pkg === "w3c-keyname" ||
            pkg === "crelt"
          ) {
            return "vendor-tiptap";
          }

          if (pkg === "framer-motion") {
            return "vendor-motion";
          }

          if (pkg.startsWith("embla-carousel")) {
            return "vendor-carousel";
          }

          if (pkg === "recharts" || pkg.startsWith("d3-")) {
            return "vendor-charts";
          }

          if (pkg.startsWith("@radix-ui/")) {
            return "vendor-ui";
          }

          return undefined;
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/sitemap.xml": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/robots.txt": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/ads.txt": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});

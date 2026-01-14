// vite.config.ts (or vite.config.mts)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path"; // Use node: prefix in ESM
import { fileURLToPath } from "node:url";
// import { loadEnv } from "vite"; // Uncomment if you need env loading

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // If you actually need env values, uncomment:
  // const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3000,
      host: true,
      strictPort: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@adk": path.resolve(__dirname, "./src/lib/adk"),
      },
    },
    css: {
      devSourcemap: true,
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
            "vendor-viz": ["@xyflow/react", "framer-motion"],
            "vendor-ai": ["@google/generative-ai"],
          },
        },
      },
    },
    // Only keep this block if you are using Vitest
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      coverage: {
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "src/test/setup.ts"],
      },
    },
  };
});

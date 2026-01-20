import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
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
        "@services": path.resolve(__dirname, "./src/services"),
        "@types": path.resolve(__dirname, "./src/types/index.ts"),
        "@config": path.resolve(__dirname, "./src/config/index.ts"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@lib": path.resolve(__dirname, "./src/lib"),
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
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      css: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "src/test/setup.ts",
          "**/*.config.{ts,js}",
          "**/types/**",
          "**/*.d.ts",
        ],
      },
    },
  };
});

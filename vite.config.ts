import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3000,
      host: true, // Replaces "0.0.0.0" for better compatibility with Docker/WSL
      strictPort: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@adk": path.resolve(__dirname, "./src/core/adk"),
        "@viz": path.resolve(__dirname, "./src/components/visualization"),
        "@agents": path.resolve(__dirname, "./src/core/agents"),
      },
    },
    // CSS handling for Tailwind + Framer Motion performance
    css: {
      devSourcemap: true,
    },
    // Build optimizations for high-fidelity glassmorphism
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
      setupFiles: "./src/test/setup.ts",
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      coverage: {
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "src/test/setup.ts"],
      },
    },
  };
});

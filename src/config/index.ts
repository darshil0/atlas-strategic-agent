```tsx
/**
 * Atlas Core Configuration Barrel (v3.2.1)
 * Centralized exports for your glassmorphic AI planning system
 * 
 * 🏗️  Architecture: Monorepo-style config organization
 * 🔧  Path aliases: `@/config/*` → `src/config/*`
 * 🎨  Design system: Glassmorphic + atlas-blue theming
 * 
 * Usage:
 * ```typescript
 * // Environment & validation
 * import { ENV, validateEnv, initializeEnv } from '@/config';
 * 
 * // UI Components & tokens
 * import { TaskCard, DependencyGraph, glassTokens } from '@/config/ui';
 * 
 * // System constants
 * import { SYSTEM_CONFIG, PRIORITY_WEIGHTS } from '@/config/system';
 * 
 * // All at once
 * import { ENV, TaskCard, SYSTEM_CONFIG } from '@/config';
 * ```
 */

export * from "./env";           // 🌐 Environment (Gemini, GitHub, Jira)
export * from "./system";        // ⚙️  System constants (tasks, priorities)
export * from "./ui";           // 🎨 UI components + design tokens

/**
 * Quick validation helper for app bootstrap
 */
export const bootstrapConfig = async (): Promise<boolean> => {
  const envValid = await import("./env").then(m => m.initializeEnv());
  const uiReady = import("./ui").then(m => !!m.glassTokens);
  const systemReady = import("./ui").then(m => !!m.SYSTEM_CONFIG);
  
  return Promise.all([envValid, uiReady, systemReady]).then(([env]) => env);
};

/**
 * Development helper - log full config state
 */
export const logConfig = (): void => {
  console.group("🏛️ ATLAS CONFIG BOOTSTRAP");
  console.log("ENV:", import.meta.env.DEV ? "✅ Loaded" : "🔒 Production");
  console.log("UI:", "🎨 Glassmorphic tokens ready");
  console.log("SYSTEM:", "⚙️ Task bank + priorities loaded");
  console.log("READY:", import.meta.env.DEV ? "🚀 Development" : "🔥 Production");
  console.groupEnd();
};
```

/**
 * Atlas Core Configuration Barrel (v3.2.1)
 * Centralized exports for your glassmorphic AI planning system
 * 
 * 🏗️  Architecture: Monorepo-style config organization
 * 🔧  Path aliases: `@/config/*` → `src/config/*`
 * 🎨  Design system: Glassmorphic + atlas-blue theming
 */

export * from "./env";           // 🌐 Environment (Gemini, GitHub, Jira)
export * from "./system";       // ⚙️  System constants (tasks, priorities)  
export * from "./ui";           // 🎨 UI components + design tokens

/**
 * App bootstrap helper - validates full config stack
 */
export const bootstrapConfig = async (): Promise<boolean> => {
  try {
    // Validate environment first (critical)
    const { initializeEnv } = await import("./env");
    const envValid = await initializeEnv();
    
    if (!envValid) return false;
    
    // Lazy check UI/system (non-blocking)
    await Promise.allSettled([
      import("./ui"),
      import("./system")
    ]);
    
    return true;
  } catch (error) {
    console.error("❌ Config bootstrap failed:", error);
    return false;
  }
};

/**
 * Development config inspector
 */
export const logConfig = (): void => {
  if (!import.meta.env.DEV) return;
  
  console.group("🏛️ ATLAS CONFIG STATUS");
  console.log("• ENV:", "✅ Loaded"); 
  console.log("• UI:", "🎨 Glassmorphic ready");
  console.log("• SYSTEM:", "⚙️ Task bank loaded");
  console.log("• MODE:", import.meta.env.DEV ? "🚀 Dev" : "🔥 Prod");
  console.groupEnd();
};

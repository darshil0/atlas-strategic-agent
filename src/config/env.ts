/**
 * Environment Configuration
 * Centralizes environment variable access, validation, and type safety for Vite.
 * Only VITE_ prefixed variables are exposed to client-side code.
 */

interface EnvConfig {
  /** Gemini API Key - Required for AI operations */
  GEMINI_API_KEY: string;
  /** Debug mode - Enable verbose logging */
  DEBUG_MODE: boolean;
  /** App version override */
  APP_VERSION?: string;
}

/**
 * Safely extracts environment variables with Vite client-side compatibility
 * Only VITE_ prefixed vars are available in browser via import.meta.env
 */
const getEnvVar = (key: string): string | undefined => {
  // Vite client-side (import.meta.env)
  if (typeof import.meta !== "undefined" && import.meta.env?.[key]) {
    return import.meta.env[key] as string;
  }
  
  // Node.js / SSR / Vitest (process.env) - only during build/test
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  
  return undefined;
};

/**
 * Typed environment configuration with fallbacks
 */
export const ENV: EnvConfig = {
  GEMINI_API_KEY: getEnvVar("VITE_GEMINI_API_KEY") ?? "",
  DEBUG_MODE: getEnvVar("VITE_DEBUG_MODE") === "true",
  APP_VERSION: getEnvVar("VITE_APP_VERSION"),
} as const;

/**
 * Validates critical environment variables and provides actionable feedback
 */
export const validateEnv = (): boolean => {
  const issues: string[] = [];
  
  if (!ENV.GEMINI_API_KEY) {
    issues.push("❌ VITE_GEMINI_API_KEY is required. Add to .env file.");
  }
  
  if (issues.length > 0) {
    console.error("🚨 Environment Validation Failed:");
    issues.forEach(issue => console.error(issue));
    console.error("\n📝 Create .env file in project root:");
    console.error("VITE_GEMINI_API_KEY=your_gemini_api_key_here");
    console.error("\n⚠️  Add .env* to .gitignore - never commit secrets!");
    return false;
  }
  
  if (ENV.DEBUG_MODE) {
    console.log("✅ Environment validated successfully");
    console.log("ENV:", { 
      GEMINI_API_KEY: ENV.GEMINI_API_KEY ? "[SET]" : "[MISSING]", 
      DEBUG_MODE: ENV.DEBUG_MODE 
    });
  }
  
  return true;
};

/**
 * Required .env template (create .env.example for git)
 */
export const ENV_TEMPLATE = `
# .env.example - Copy to .env and fill in your values
# NEVER commit .env files - they're in .gitignore!

VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_DEBUG_MODE=false
VITE_APP_VERSION=3.2.0
`;

/**
 * Security reminder - displayed in dev mode
 */
if (ENV.DEBUG_MODE && import.meta.env.DEV) {
  console.warn("🔒 SECURITY: API keys in VITE_* vars are visible in browser dev tools!");
  console.warn("For production secrets, use backend proxy endpoints.");
}

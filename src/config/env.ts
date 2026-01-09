/**
 * Environment Configuration
 * Centralizes environment variable access and validation.
 */

const getEnvVar = (key: string): string | undefined => {
    // Vite / Browser
    if (import.meta && import.meta.env && (import.meta.env as any)[key]) {
        return (import.meta.env as any)[key];
    }

    // Node.js / Vitest
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }

    return undefined;
};

export const ENV = {
    GEMINI_API_KEY: getEnvVar("VITE_GEMINI_API_KEY") || getEnvVar("GEMINI_API_KEY") || getEnvVar("API_KEY") || "",
} as const;

export const validateEnv = () => {
    if (!ENV.GEMINI_API_KEY) {
        console.warn("⚠️ Atlas Config Warning: Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env");
    }
};

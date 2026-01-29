/**
 * Atlas TypeScript Declarations (v3.2.7) - Production Type Definitions
 * Comprehensive typing for MissionControl ADK, Glassmorphic A2UI, ReactFlow
 * Centralized types for @types/plan.types → @lib/adk/* → @services/*
 */


import type {
  SubTask,
  Plan,
  Message,
  TaskStatus,
  Priority,
  BankTask,
  AGUIEvent,
  A2UIMessage,
  A2UIElement
} from "@types";

// === ATLAS A2UI PROTOCOL (Glassmorphic UI) ===
declare namespace A2UI {
  export type { A2UIMessage, A2UIElement };
}

// === MISSIONCONTROL ADK TYPES ===
declare namespace ADK {
  enum AgentPersona {
    STRATEGIST = "STRATEGIST",
    ANALYST = "ANALYST",
    CRITIC = "CRITIC"
  }

  enum AgentMode {
    AUTONOMOUS = "AUTONOMOUS",
    COLLABORATIVE = "COLLABORATIVE"
  }

  interface AgentResponse {
    text: string;
    a2ui?: A2UIMessage;
    validation?: {
      iterations: number;
      finalScore: number;
      graphReady: boolean;
      q1HighCount: number;
    };
  }
}

// === VITE ENV TYPING ===
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_TASKBANK_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// === GLOBAL TEST UTILITIES ===
declare global {
  interface Window {
    ATLAS_TEST_UTILS?: {
      createMockPlan: () => Plan;
      mockMissionControlResponse: () => ADK.AgentResponse;
      resetAtlasMocks: () => void;
    };
  }

  const ATLAS_TEST_UTILS: Window["ATLAS_TEST_UTILS"];
}

// Export core types for barrel re-export
export type {
  SubTask,
  Plan,
  Message,
  TaskStatus,
  Priority,
  BankTask,
  AGUIEvent
};

export { A2UI, ADK };

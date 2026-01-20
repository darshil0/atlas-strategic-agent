/**
 * Atlas TypeScript Declarations (v3.2.1) - Production Type Definitions
 * Comprehensive typing for MissionControl ADK, Glassmorphic A2UI, ReactFlow
 * Centralized types for @types/plan.types → @lib/adk/* → @services/*
 */

// src/types/index.d.ts
import type React from "react";

// === ATLAS A2UI PROTOCOL (Glassmorphic UI) ===
declare namespace A2UI {
  interface BaseElement {
    type: string;
    id: string;
    className?: string;
    style?: React.CSSProperties;
  }

  interface PanelElement extends BaseElement {
    type: "panel";
    title: string;
    children: A2UIElement[];
  }

  interface CardElement extends BaseElement {
    type: "card";
    title: string;
    subtitle?: string;
    children: A2UIElement[];
  }

  interface ButtonElement extends BaseElement {
    type: "button";
    label: string;
    actionData: string;
    variant?: "primary" | "secondary" | "danger" | "ghost";
  }

  interface ProgressElement extends BaseElement {
    type: "progress";
    label: string;
    value: number;
    max?: number;
  }

  type A2UIElement = PanelElement | CardElement | ButtonElement | ProgressElement;
  
  interface A2UIMessage {
    version: "1.1";
    elements: A2UIElement[];
    timestamp: number;
  }
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
    a2ui?: A2UI.A2UIMessage;
    validation?: {
      iterations: number;
      finalScore: number;
      graphReady: boolean;
      q1HighCount: number;
    };
  }
}

// === CORE PLANNING TYPES ===
export interface SubTask {
  id: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category: string; // "2026 Q1", "2026 Q2", etc.
  theme?: string;   // "AI", "Cyber", "Infra"
  dependencies: string[];
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS", 
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  BLOCKED = "BLOCKED",
  WAITING = "WAITING"
}

export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

export interface Plan {
  name?: string;
  goal: string;
  projectName: string;
  tasks: SubTask[];
}

// === MESSAGE & CHAT SYSTEM ===
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  a2ui?: string; // JSON stringified A2UIMessage
}

// === SERVICE INTEGRATION TYPES ===
export interface GithubIssueResult {
  success: boolean;
  issueNumber?: number;
  htmlUrl?: string;
  taskId?: string;
  error?: string;
}

export interface JiraTicketResult {
  success: boolean;
  issueKey?: string;
  issueId?: string;
  webUrl?: string;
  taskId?: string;
  error?: string;
}

export interface SyncResult {
  github: GithubSyncResult | null;
  jira: JiraSyncResult | null;
  totalCreated: number;
  timestamp: string;
}

export interface GithubSyncResult {
  created: number;
  skipped: number;
  failed: GithubIssueResult[];
}

export interface JiraSyncResult {
  created: number;
  skipped: number;
  failed: JiraTicketResult[];
}

// === TASKBANK TYPES ===
export interface BankTask {
  id: string;
  description: string;
  priority: Priority;
  category: string;
  theme: string;
}

// === A2UI EVENT PROTOCOL ===
export interface AGUIEvent {
  action: string;
  elementId: string;
  payload?: Record<string, any>;
}

// === REACT COMPONENT PROPS ===
export interface TaskCardProps {
  task: SubTask;
  isActive: boolean;
  isBlocked: boolean;
  onClick: (id: string) => void;
  onDecompose: (id: string) => void;
  onExport: (id: string, type: "github" | "jira") => Promise<void>;
  exported?: { github?: string; jira?: string };
  onSimulateFailure?: (id: string) => void;
}

export interface DependencyGraphProps {
  tasks: SubTask[];
  activeTaskId: string | null;
  onTaskSelect: (id: string) => void;
  isTaskBlocked: (task: SubTask, allTasks: SubTask[]) => boolean;
  onConnect: (source: string, target: string) => void;
  isWhatIfEnabled: boolean;
  simulationResult: {
    cascade: string[];
    riskScore: number;
    impactedHighPriority: number;
  } | null;
  onSimulateFailure: (taskId: string) => void;
}

// === CUSTOM JSX ELEMENTS (Glassmorphic A2UI) ===
declare namespace JSX {
  interface IntrinsicElements {
    "a2ui-panel": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > & {
      title?: string;
    };
    
    "a2ui-card": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > & {
      title?: string;
      subtitle?: string;
    };
    
    "a2ui-button": React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > & {
      actionData?: string;
      variant?: "primary" | "secondary" | "danger" | "ghost";
    };
    
    "a2ui-progress": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > & {
      value: number;
      max?: number;
      label?: string;
    };
  }
}

// === VITE ENV TYPING ===
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_TASKBANK_SIZE: string;
  // more env variables...
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
  
  namespace NodeJS {
    interface Global {
      ATLAS_TEST_UTILS: Window["ATLAS_TEST_UTILS"];
    }
  }
}

// Export core types for barrel re-export
export type {
  SubTask,
  Plan,
  Message,
  TaskStatus,
  Priority,
  BankTask,
  AGUIEvent,
  TaskCardProps,
  DependencyGraphProps
};

export { A2UI, ADK };

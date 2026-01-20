/**
 * Atlas ADK Types (v3.2.1) - Glassmorphic Agent Swarm Foundation
 * Type-safe contracts for MissionControl → AgentFactory → A2UIRenderer pipeline
 * Powers your 2026 strategic roadmap orchestration with ReactFlow integration
 */

import { A2UIMessage, AGUIEvent, AGUIAction } from "@lib/adk/protocol";

/**
 * Glassmorphic Agent Personas - Strategist/Analyst/Critic swarm
 */
export enum AgentPersona {
  STRATEGIST = "Strategist",    // Goal → 2026 Q1-Q4 roadmap JSON
  ANALYST = "Analyst",          // TASK_BANK alignment + feasibility
  CRITIC = "Critic",            // DAG validation + Q1 capacity analysis
}

/**
 * Universal agent execution context - ReactFlow + TaskBank ready
 */
export interface AgentExecutionContext {
  sessionId?: string;
  metadata?: Record<string, unknown>;
  goal?: string;                    // C-level strategic objective
  activeTaskId?: string;            // DependencyGraph focus
  plan?: unknown;                   // Current roadmap state
  previousPlan?: unknown;           // Iteration history
  criticFeedback?: unknown;         // Refinement input
  taskBank?: unknown;               // 90+ enterprise objectives
  [key: string]: unknown;
}

/**
 * Production runtime context with required fields
 */
export interface AgentRuntimeContext extends AgentExecutionContext {
  sessionId: string;
  metadata: Record<string, unknown>;
}

/**
 * Production BaseAgent - Glassmorphic agent contract
 */
export abstract class BaseAgent {
  /**
   * Unique agent identifier for MissionControl routing
   */
  abstract readonly name: string;

  /**
   * Capabilities description for A2UI agent selector
   */
  abstract readonly description: string;

  /**
   * Handle glassmorphic UI events from A2UIRenderer
   * task_select → decompose → export_github workflow
   */
  abstract handleEvent(event: AGUIEvent): Promise<A2UIMessage>;

  /**
   * Execute core agent reasoning with full context
   * @returns ReactFlow-ready Plan or analysis result
   */
  abstract execute<R = unknown>(
    prompt: string,
    context?: AgentExecutionContext
  ): Promise<R>;

  /**
   * Initial glassmorphic UI for agent activation
   * Renders in A2UIRenderer with glass-1/2 containers
   */
  abstract getInitialUI(): A2UIMessage;
}

/**
 * Agent lifecycle hooks (optional extension points)
 */
export interface AgentLifecycle {
  onActivate?(context: AgentRuntimeContext): Promise<void>;
  onDeactivate?(context: AgentRuntimeContext): Promise<void>;
}

/**
 * MissionControl orchestration result type
 */
export interface MissionResult {
  text: string;                    // Human-readable summary
  a2ui?: A2UIMessage;             // Glassmorphic UI state
  plan?: unknown;                 // ReactFlow DependencyGraph data
  validation: {
    iterations: number;
    finalScore: number;
    graphReady: boolean;
    q1HighCount: number;
  };
}

/**
 * Failure cascade result for DependencyGraph "What-If" visualization
 */
export interface FailureCascadeResult {
  cascade: string[];              // Impacted task IDs
  riskScore: number;              // % plan impact
  impactedHighPriority: number;   // Critical path damage
}

/**
 * Type utilities for agent development
 */
export type AgentResult<T = unknown> = Promise<T>;
export type TypedAgent<R> = BaseAgent & {
  execute: (prompt: string, context?: AgentExecutionContext) => AgentResult<R>;
};

/**
 * Factory type for perfect TypeScript inference
 */
export type AgentConstructor = new () => BaseAgent;

/**
 * Development utilities
 */
export const AGENT_PERSONAS = Object.values(AgentPersona) as AgentPersona[];
export const DEFAULT_SESSION_ID = `atlas-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

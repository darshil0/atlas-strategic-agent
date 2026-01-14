import { A2UIMessage, AGUIEvent } from "./protocol";

/**
 * Agent Personas for multi-agent orchestration
 */
export enum AgentPersona {
  STRATEGIST = "Strategist",
  ANALYST = "Analyst", 
  CRITIC = "Critic",
}

/**
 * Shared execution context across all agents
 */
export interface AgentExecutionContext {
  sessionId?: string;
  metadata?: Record<string, unknown>;
  goal?: string;
  activeTaskId?: string;
  plan?: unknown;
  [key: string]: unknown;
}

/**
 * Runtime agent context (required fields)
 */
export interface AgentRuntimeContext extends AgentExecutionContext {
  sessionId: string;
  metadata: Record<string, unknown>;
}

/**
 * Base agent contract for Atlas Strategic Agent system
 * Defines core interface for all specialized agents
 */
export abstract class BaseAgent {
  /**
   * Unique agent identifier
   */
  abstract readonly name: string;

  /**
   * Human-readable description of agent capabilities
   */
  abstract readonly description: string;

  /**
   * Handle UI interaction events from A2UIRenderer
   */
  abstract handleEvent(event: AGUIEvent): Promise<A2UIMessage>;

  /**
   * Execute agent-specific logic with prompt and context
   * @param prompt User input or goal
   * @param context Execution context with session data
   * @returns Agent-specific result type
   */
  abstract execute<R = unknown>(
    prompt: string,
    context?: AgentExecutionContext
  ): Promise<R>;

  /**
   * Get initial UI state when agent is activated
   */
  abstract getInitialUI(): A2UIMessage;
}

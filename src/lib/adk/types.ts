import { A2UIMessage, AGUIEvent } from "./protocol";

export enum AgentPersona {
  STRATEGIST = "Strategist",
  ANALYST = "Analyst",
  CRITIC = "Critic",
}

export type AgentExecutionContext = {
  sessionId?: string;
  metadata?: Record<string, unknown>;
} & Record<string, unknown>;

export abstract class BaseAgent {
  abstract name: string;
  abstract description: string;
  abstract handleEvent(event: AGUIEvent): Promise<A2UIMessage>;

  abstract execute<R = unknown>(
    prompt: string,
    context?: AgentExecutionContext,
  ): Promise<R>;

  abstract getInitialUI(): A2UIMessage;
}

export interface AgentContext {
  sessionId: string;
  metadata: Record<string, unknown>;
}

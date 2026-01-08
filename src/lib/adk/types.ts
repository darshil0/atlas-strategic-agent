<<<<<<< HEAD
﻿import { A2UIMessage, AGUIEvent } from "./protocol";
=======
import { A2UIMessage, AGUIEvent } from "./protocol";
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44

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
  // Generic result type so concrete agents can specify their return shape if desired.
<<<<<<< HEAD
  abstract execute(
    prompt: string,
    context?: AgentExecutionContext,
  ): Promise<any>;
=======
  abstract execute<R = unknown>(
    prompt: string,
    context?: AgentExecutionContext,
  ): Promise<R>;
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  abstract getInitialUI(): A2UIMessage;
}

export interface AgentContext {
  sessionId: string;
  metadata: Record<string, unknown>;
}
<<<<<<< HEAD

=======
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44

/**
 * AgentFactory: Creates specialized agents by persona
 * Exhaustive pattern matching with TypeScript never type safety
 */
import { BaseAgent, AgentPersona } from "./types";
import { StrategistAgent, AnalystAgent, CriticAgent } from "./agents";

export class AgentFactory {
  static create(persona: AgentPersona): BaseAgent {
    switch (persona) {
      case AgentPersona.STRATEGIST:
        return new StrategistAgent();
      case AgentPersona.ANALYST:
        return new AnalystAgent();
      case AgentPersona.CRITIC:
        return new CriticAgent();
      default: {
        // PERFECT: Exhaustiveness check catches new enum values
        const _exhaustiveCheck: never = persona;
        throw new Error(`Unknown agent persona: ${_exhaustiveCheck}`);
      }
    }
  }
}

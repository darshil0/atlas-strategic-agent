import { BaseAgent, AgentPersona } from "./types";
import {
  StrategistAgent,
  AnalystAgent,
  CriticAgent,
} from "./agents";

/**
 * AgentFactory: Responsibility is to instantiate agents based on personas.
 */
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
        // Exhaustiveness check: if a new enum member is added and not handled above,
        // TypeScript will flag this line.
        const _exhaustiveCheck: never = persona;
        throw new Error(`Unknown persona: ${_exhaustiveCheck}`);
      }
    }
  }
}

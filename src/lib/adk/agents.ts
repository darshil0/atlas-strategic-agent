import { UIBuilder } from "./index";
import { BaseAgent } from "./types";
import { A2UIMessage, AGUIEvent, A2UIComponentType } from "./protocol";

type StrategyContext = {
  plan?: unknown;
  [key: string]: unknown;
};

export class StrategistAgent extends BaseAgent {
  name = "Strategist";
  description = "Specializes in goal decomposition and roadmap logic.";

  async handleEvent(event: AGUIEvent): Promise<A2UIMessage> {
    return new UIBuilder()
      .add(A2UIComponentType.TEXT, {
        text: `Strategist received: ${event.action}`,
      })
      .build();
  }

  async execute<R = unknown>(
    _prompt: string,
    context?: StrategyContext,
  ): Promise<R> {
    const result = context ?? { plan: "Draft Strategy" };
    return result as unknown as R;
  }

  getInitialUI(): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.TEXT, { text: "Strategist Ready." })
      .build();
  }
}

type AnalystResult = {
  feasibility: number;
  notes: string;
};

export class AnalystAgent extends BaseAgent {
  name = "Analyst";
  description = "Focuses on data grounding and feasibility analysis.";

  async handleEvent(_event: AGUIEvent): Promise<A2UIMessage> {
    return new UIBuilder()
      .add(A2UIComponentType.CHART, {
        title: "Feasibility Score",
        data: [
          { label: "Risk", value: 30 },
          { label: "Confidence", value: 85 },
        ],
      })
      .build();
  }

  async execute<R = unknown>(
    _prompt: string,
    _context?: StrategyContext,
  ): Promise<R> {
    const result: AnalystResult = { feasibility: 0.9, notes: "Verified grounding context." };
    return result as unknown as R;
  }

  getInitialUI(): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.TEXT, { text: "Analyst Ready." })
      .build();
  }
}

type CriticResult = {
  score: number;
  risks: unknown[];
};

export class CriticAgent extends BaseAgent {
  name = "Critic";
  description = "Reviews plans for risks and identifies missing dependencies.";

  async handleEvent(_event: AGUIEvent): Promise<A2UIMessage> {
    return new UIBuilder()
      .add(A2UIComponentType.CARD, {
        title: "Risk Report",
        children: [],
      })
      .build();
  }

  async execute<R = unknown>(
    _prompt: string,
    _context?: StrategyContext,
  ): Promise<R> {
    const result: CriticResult = { score: 90, risks: [] };
    return result as unknown as R;
  }

  getInitialUI(): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.TEXT, { text: "Critic Ready." })
      .build();
  }
}

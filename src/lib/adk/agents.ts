import { UIBuilder } from "./uiBuilder";
import { BaseAgent } from "./types";
import { A2UIMessage, AGUIEvent, A2UIComponentType } from "./protocol";
import { TaskStatus, Priority } from "../../types";
import { ENV } from "../../config";

type StrategyTask = {
  id: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dependencies: string[];
};

type StrategyContext = {
  goal: string;
  tasks: StrategyTask[];
  activeTaskId?: string;
};

/**
 * Strategist Agent - Goal decomposition and roadmap generation
 */
export class StrategistAgent extends BaseAgent<StrategyContext, Partial<StrategyContext>> {
  name = "Strategist";
  description =
    "Decomposes complex goals into executable 2026 roadmaps with dependency graphs.";

  async handleEvent(event: AGUIEvent): Promise<A2UIMessage> {
    switch (event.action) {
      case "task_select":
        return new UIBuilder()
          .add(A2UIComponentType.PROGRESS, {
            label: "Strategic Alignment",
            value: 75,
          })
          .add(A2UIComponentType.TEXT, {
            text: `Strategist analyzing task ${event.elementId ?? "N/A"}`,
          })
          .build();

      case "decompose":
        return new UIBuilder()
          .add(A2UIComponentType.TEXT, {
            text: "Generating hierarchical task decomposition...",
          })
          .build();

      default: {
        const actionLabel = event.action ?? "unknown";
        return new UIBuilder()
          .add(A2UIComponentType.TEXT, {
            text: `Strategist acknowledged: ${actionLabel}`,
          })
          .build();
      }
    }
  }

  async execute(
    prompt: string,
    context: Partial<StrategyContext> = {}
  ): Promise<StrategyContext> {
    const plan: StrategyContext = {
      goal: context.goal ?? `Strategic execution plan for: ${prompt}`,
      tasks:
        context.tasks ??
        [
          {
            id: "STRAT-001",
            description: "Initial goal validation and scope definition",
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.HIGH,
            dependencies: [],
          },
          {
            id: "STRAT-002",
            description: "Dependency mapping and risk assessment",
            status: TaskStatus.PENDING,
            priority: Priority.MEDIUM,
            dependencies: ["STRAT-001"],
          },
        ],
      activeTaskId: context.activeTaskId,
    };

    if (ENV && ENV.DEBUG_MODE) {
      // eslint-disable-next-line no-console
      console.log("[Strategist] Generated plan:", plan);
    }

    return plan;
  }

  getInitialUI(): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.CARD, {
        title: "Strategist Agent",
        children: [
          [
            A2UIComponentType.TEXT,
            {
              text: "Ready for goal decomposition and roadmap generation.",
            },
          ],
        ],
      })
      .build();
  }
}

/**
 * Analyst Agent - Feasibility scoring and data grounding
 */
export interface AnalystResult {
  feasibility: number; // 0-100 score
  confidence: number; // 0-100 confidence
  risks: string[];
  recommendations: string[];
}

export class AnalystAgent extends BaseAgent<AnalystResult, StrategyContext> {
  name = "Analyst";
  description =
    "Performs feasibility analysis, risk scoring, and data validation.";

  async handleEvent(event: AGUIEvent): Promise<A2UIMessage> {
    return new UIBuilder()
      .add(A2UIComponentType.CHART, {
        title: "Feasibility Analysis",
        data: [
          { label: "Technical", value: 92 },
          { label: "Market", value: 78 },
          { label: "Risk", value: 22 },
          { label: "Cost", value: 85 },
        ],
        maxValue: 100,
      })
      .add(A2UIComponentType.TEXT, {
        text: `Analysis complete for ${event.elementId ?? "N/A"}`,
      })
      .build();
  }

  async execute(
    _prompt: string,
    _context: StrategyContext = {}
  ): Promise<AnalystResult> {
    const analysis: AnalystResult = {
      feasibility: 87,
      confidence: 94,
      risks: [
        "Moderate dependency on Q2 vendor delivery",
        "Regulatory approval timeline uncertainty",
      ],
      recommendations: [
        "Prioritize CY-26-001 zero-trust implementation first",
        "Parallel-track IN-26-003 quantum-resistant migration",
      ],
    };

    if (ENV && ENV.DEBUG_MODE) {
      // eslint-disable-next-line no-console
      console.log("[Analyst] Feasibility score:", analysis);
    }

    return analysis;
  }

  getInitialUI(): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.TEXT, {
        text: "Analyst ready for feasibility scoring and risk assessment.",
      })
      .build();
  }
}

/**
 * Critic Agent - Plan review and optimization
 */
export enum CriticIssueType {
  DEPENDENCY = "dependency",
  PRIORITY = "priority",
  TIMELINE = "timeline",
  RISK = "risk",
}

export enum CriticSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface CriticIssue {
  type: CriticIssueType;
  severity: CriticSeverity;
  description: string;
}

export interface CriticResult {
  score: number; // 0-100
  issues: CriticIssue[];
  optimizations: string[];
}

export class CriticAgent extends BaseAgent<CriticResult, StrategyContext> {
  name = "Critic";
  description =
    "Identifies plan gaps, circular dependencies, and optimization opportunities.";

  async handleEvent(_event: AGUIEvent): Promise<A2UIMessage> {
    return new UIBuilder()
      .add(A2UIComponentType.CARD, {
        title: "Critic Review",
        children: [
          [
            A2UIComponentType.LIST,
            {
              items: [
                { label: "No circular dependencies detected", icon: "✅" },
                { label: "Q1 overload: 18 critical tasks", icon: "⚠️" },
                { label: "CY-26-005 QKD blocked by vendor", icon: "🚫" },
              ],
            },
          ],
        ],
      })
      .build();
  }

  async execute(
    _prompt: string,
    _context: StrategyContext = {}
  ): Promise<CriticResult> {
    const review: CriticResult = {
      score: 88,
      issues: [
        {
          type: CriticIssueType.TIMELINE,
          severity: CriticSeverity.MEDIUM,
          description: "Q1 overloaded (18 HIGH priority tasks)",
        },
        {
          type: CriticIssueType.DEPENDENCY,
          severity: CriticSeverity.HIGH,
          description: "CY-26-005 blocked by unlisted vendor contract",
        },
      ],
      optimizations: [
        "Parallelize AI-26-001 and IN-26-002",
        "Move ES-26-001 to Q2 to balance workload",
      ],
    };

    if (ENV && ENV.DEBUG_MODE) {
      // eslint-disable-next-line no-console
      console.log("[Critic] Plan review score:", review.score);
    }

    return review;
  }

  getInitialUI(): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.TEXT, {
        text: "Critic ready for plan validation and optimization.",
      })
      .build();
  }
}

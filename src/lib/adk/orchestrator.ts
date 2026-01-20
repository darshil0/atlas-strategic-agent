/**
 * Atlas MissionControl (v3.2.1) - Glassmorphic Multi-Agent Orchestrator
 * Coordinates Strategist → Analyst → Critic swarm for 2026 enterprise roadmaps
 * ReactFlow visualization + A2UI glassmorphic feedback + failure cascade analysis
 */

import { A2UIMessage } from "@lib/adk/protocol";
import { BaseAgent, AgentPersona, AgentExecutionContext } from "@lib/adk/types";
import type { Plan, SubTask } from "@types/plan.types";
import { AgentFactory } from "@lib/adk/factory";
import { ENV } from "@config";
import { TASK_BANK } from "@data/taskBank";

/**
 * Production MissionControl - Full agent swarm orchestration
 */
export class MissionControl {
  private agents: Map<AgentPersona, BaseAgent> = new Map();
  private readonly maxIterations = 3;
  private readonly scoreThreshold = 88; // Raised for production quality

  constructor() {
    // Initialize glassmorphic agent ensemble
    this.agents.set(AgentPersona.STRATEGIST, AgentFactory.getOrCreate(AgentPersona.STRATEGIST));
    this.agents.set(AgentPersona.ANALYST, AgentFactory.getOrCreate(AgentPersona.ANALYST));
    this.agents.set(AgentPersona.CRITIC, AgentFactory.getOrCreate(AgentPersona.CRITIC));

    if (ENV.DEBUG_MODE) {
      console.group("🏛️ [MissionControl] Swarm Initialized");
      console.log("Agents:", Array.from(this.agents.keys()).join(" → "));
      console.log("Pipeline:", "Strategist → Analyst → Critic → Visualize");
      console.log("Max iterations:", this.maxIterations);
      console.groupEnd();
    }
  }

  private getAgent(persona: AgentPersona): BaseAgent {
    const agent = this.agents.get(persona);
    if (!agent) {
      throw new Error(`🚨 [MissionControl] Missing agent: ${persona}`);
    }
    return agent;
  }

  /**
   * Full swarm pipeline: Goal → 2026 Roadmap → Analysis → Optimization
   * Returns ReactFlow-ready Plan + glassmorphic A2UI feedback
   */
  async processCollaborativeInput(
    goal: string,
    context: AgentExecutionContext = {}
  ): Promise<{ 
    text: string; 
    a2ui?: A2UIMessage; 
    plan?: Plan;
    validation: {
      iterations: number;
      finalScore: number;
      graphReady: boolean;
      q1HighCount: number;
    };
  }> {
    if (ENV.DEBUG_MODE) {
      console.group("🚀 [MissionControl] 2026 SYNTHESIS START");
      console.log("🎯 Goal:", goal.slice(0, 80) + "...");
    }

    let proposal: unknown = {};
    let iterations = 0;
    let criticScore = 0;

    // === PHASE 1: STRATEGIST ROADMAP GENERATION ===
    const strategist = this.getAgent(AgentPersona.STRATEGIST);
    proposal = await strategist.execute(goal, context);

    // === PHASE 2: CRITIC-LED ITERATIVE REFINEMENT ===
    while (iterations < this.maxIterations) {
      const criticResult = await this.evaluatePlan(proposal as Plan);
      criticScore = criticResult.score;

      if (criticResult.score >= this.scoreThreshold || iterations >= this.maxIterations - 1) {
        break;
      }

      iterations++;
      
      if (ENV.DEBUG_MODE) {
        console.log(`🔄 Iteration ${iterations}: ${criticScore}/100`);
      }

      // Strategist refines based on critic feedback
      const feedbackPrompt = [
        goal,
        `\n--- CRITIC SCORE: ${criticScore}/100 ---`,
        ...criticResult.issues.slice(0, 3).map(i => `• ${i.description}`)
      ].join("\n");

      proposal = await strategist.execute(feedbackPrompt, { 
        ...context, 
        previousPlan: proposal,
        criticFeedback: criticResult 
      });
    }

    // === PHASE 3: ANALYST FINAL VALIDATION ===
    const analyst = this.getAgent(AgentPersona.ANALYST);
    const analysis = await analyst.execute("Final 2026 feasibility validation", {
      plan: proposal,
      taskBank: TASK_BANK,
    });

    // === PHASE 4: GLASSMORPHIC SUMMARY ===
    const q1HighCount = (proposal as Plan)?.tasks?.filter(
      t => t.priority === Priority.HIGH && t.category?.includes("Q1")
    )?.length || 0;

    const result = {
      text: this.formatGlassmorphicSummary(goal, iterations, criticScore, analysis, q1HighCount),
      a2ui: this.createGlassmorphicUI(goal, iterations, criticScore, q1HighCount),
      plan: proposal as Plan | undefined,
      validation: {
        iterations,
        finalScore: criticScore,
        graphReady: criticScore >= 80,
        q1HighCount,
      },
    };

    if (ENV.DEBUG_MODE) {
      console.groupEnd();
      console.log("✅ [MissionControl] Pipeline complete:", result.validation);
    }

    return result;
  }

  /**
   * ReactFlow "What-If" failure cascade simulation
   * Visualizes dependency chain impact in DependencyGraph
   */
  async simulateFailure(plan: Plan, failedTaskId: string): Promise<{ 
    cascade: string[]; 
    riskScore: number; 
    impactedHighPriority: number;
  }> {
    if (!plan.tasks?.length) {
      return { cascade: [failedTaskId], riskScore: 100, impactedHighPriority: 0 };
    }

    const cascade = new Set([failedTaskId]);
    const queue: string[] = [failedTaskId];
    let highPriorityImpact = 0;

    // BFS dependency traversal
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const dependents = plan.tasks.filter((task: SubTask) =>
        task.dependencies?.includes(currentId)
      );

      for (const dependent of dependents) {
        if (!cascade.has(dependent.id)) {
          cascade.add(dependent.id);
          queue.push(dependent.id);
          
          // Track HIGH priority impact
          if (dependent.priority === Priority.HIGH) {
            highPriorityImpact++;
          }
        }
      }
    }

    const totalTasks = plan.tasks.length;
    const riskScore = Math.round((cascade.size / totalTasks) * 100 * 10) / 10;

    if (ENV.DEBUG_MODE) {
      console.warn("💥 [Cascade] Failure simulation:", {
        failed: failedTaskId,
        cascade: cascade.size,
        risk: `${riskScore}%`,
        critical: highPriorityImpact,
      });
    }

    return {
      cascade: Array.from(cascade),
      riskScore,
      impactedHighPriority: highPriorityImpact,
    };
  }

  /**
   * Production plan evaluation via Critic agent
   */
  private async evaluatePlan(plan: Plan): Promise<{ 
    score: number; 
    issues: Array<{ type: string; severity: string; description: string }>;
    feedback: string[];
  }> {
    const critic = this.getAgent(AgentPersona.CRITIC);
    
    try {
      const result = await critic.execute("Comprehensive 2026 roadmap evaluation", {
        plan,
        taskBank: TASK_BANK,
      });

      const criticResult = result as any;
      return {
        score: Math.max(0, Math.min(100, criticResult.score ?? 50)),
        issues: criticResult.issues ?? [],
        feedback: criticResult.feedback ?? ["Evaluation complete"],
      };
    } catch (error) {
      console.error("🚨 [MissionControl] Critic failed:", error);
      return { 
        score: 50, 
        issues: [],
        feedback: ["Critic evaluation temporarily unavailable"] 
      };
    }
  }

  /**
   * Glassmorphic summary matching your design system
   */
  private formatGlassmorphicSummary(
    goal: string,
    iterations: number,
    score: number,
    analysis: any,
    q1HighCount: number
  ): string {
    const feasibility = analysis?.feasibility ?? 87;
    
    return `\
🏛️ **ATLAS v3.2.1 SYNTHESIS COMPLETE**

🎯 **Goal**: ${goal.substring(0, 80)}${goal.length > 80 ? "..." : ""}

📊 **Metrics**
• Iterations: ${iterations + 1}
• Quality Score: **${score}/100**
• Feasibility: **${feasibility}%**
• Q1 Critical: **${q1HighCount} HIGH**

✅ **ReactFlow Ready**: ${score >= 80 ? "🎨 Visualizable" : "⚠️ Needs refinement"}
🚀 **Status**: Execution pipeline primed
`;
  }

  /**
   * A2UI glassmorphic dashboard for real-time feedback
   */
  private createGlassmorphicUI(
    goal: string,
    iterations: number,
    score: number,
    q1HighCount: number
  ): A2UIMessage {
    return new UIBuilder()
      .add(A2UIComponentType.CARD, {
        title: "🏛️ MissionControl Status",
        children: [
          A2UIComponentType.PROGRESS,
          {
            label: "Plan Quality",
            value: score,
          },
          A2UIComponentType.LIST,
          {
            items: [
              { label: `Q1 Critical Path: ${q1HighCount}`, icon: "📈" },
              { label: `Refinement Cycles: ${iterations + 1}`, icon: "🔄" },
              { label: goal.slice(0, 40) + "...", icon: "🎯" },
            ],
          },
        ],
      })
      .build();
  }
}

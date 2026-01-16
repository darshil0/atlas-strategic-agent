import { A2UIMessage } from "./protocol";
import { BaseAgent, AgentPersona, AgentExecutionContext } from "./types";
import type { Plan, SubTask } from "../../types";
import { AgentFactory } from "./factory";
import { ENV } from "../../config";

/**
 * MissionControl: Multi-agent orchestrator for collaborative strategic synthesis
 * Coordinates Strategist → Analyst → Critic workflow for robust plan generation
 */
export class MissionControl {
  private agents: Map<AgentPersona, BaseAgent> = new Map();
  private readonly maxIterations = 3;
  private readonly scoreThreshold = 85;

  constructor() {
    // Initialize agent ensemble
    this.agents.set(AgentPersona.STRATEGIST, AgentFactory.create(AgentPersona.STRATEGIST));
    this.agents.set(AgentPersona.ANALYST, AgentFactory.create(AgentPersona.ANALYST));
    this.agents.set(AgentPersona.CRITIC, AgentFactory.create(AgentPersona.CRITIC));

    if (ENV.DEBUG_MODE) {
      console.log("[MissionControl] Initialized with agents:", Array.from(this.agents.keys()));
    }
  }

  private getAgent(persona: AgentPersona): BaseAgent {
    const agent = this.agents.get(persona);
    if (!agent) {
      throw new Error(`[MissionControl] Agent not registered: ${persona}`);
    }
    return agent;
  }

  /**
   * Orchestrates full multi-agent planning cycle
   * Strategist → Analyst → Critic → Refine (up to 3 iterations)
   */
  async processCollaborativeInput(
    goal: string,
    context: AgentExecutionContext = {}
  ): Promise<{ text: string; a2ui?: A2UIMessage; plan?: Plan }> {
    if (ENV.DEBUG_MODE) {
      console.log("[MissionControl] Starting collaborative synthesis:", { goal });
    }

    let proposal: unknown;
    let iterations = 0;

    // Phase 1: Strategist generates initial plan
    const strategist = this.getAgent(AgentPersona.STRATEGIST);
    proposal = await strategist.execute(goal, context);

    // Phase 2: Iterative refinement via Critic feedback
    while (iterations < this.maxIterations) {
      const criticResult = await this.evaluatePlan(proposal);

      if (criticResult.score >= this.scoreThreshold || iterations >= this.maxIterations - 1) {
        break;
      }

      iterations++;

      if (ENV.DEBUG_MODE) {
        console.log(`[MissionControl] Iteration ${iterations}: Score ${criticResult.score}`);
      }

      // Feed critic feedback back to strategist
      const feedbackPrompt = [
        goal,
        `CRITIC FEEDBACK (Score: ${criticResult.score}):`,
        ...criticResult.feedback.slice(0, 3), // Top 3 issues
      ].join("\n");

      proposal = await strategist.execute(feedbackPrompt, { ...context, plan: proposal });
    }

    // Phase 3: Analyst validation
    const analyst = this.getAgent(AgentPersona.ANALYST);
    const analysis = await analyst.execute("Final feasibility check", {
      ...context,
      plan: proposal
    }) as { feasibility?: number; notes?: string[] };

    // Phase 4: Return coordinated result
    const result = {
      text: this.formatSynthesisSummary(goal, iterations, analysis, proposal),
      a2ui: strategist.getInitialUI(),
      plan: proposal as Plan | undefined,
    };

    if (ENV.DEBUG_MODE) {
      console.log("[MissionControl] Synthesis complete:", { iterations, score: await this.evaluatePlan(proposal) });
    }

    return result;
  }

  /**
   * Simulates task failure cascade analysis for risk visualization
   */
  async simulateFailure(plan: Plan, failedTaskId: string): Promise<{ cascade: string[]; riskScore: number }> {
    if (!plan.tasks?.length) {
      return { cascade: [failedTaskId], riskScore: 100 };
    }

    const cascade = new Set([failedTaskId]);
    const queue: string[] = [failedTaskId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const dependents = plan.tasks.filter((task: SubTask) =>
        task.dependencies?.includes(currentId)
      );

      for (const dependent of dependents) {
        if (!cascade.has(dependent.id)) {
          cascade.add(dependent.id);
          queue.push(dependent.id);
        }
      }
    }

    const taskCount = plan.tasks.length;
    const riskScore = Math.round((cascade.size / taskCount) * 100 * 10) / 10; // 1 decimal

    return {
      cascade: Array.from(cascade),
      riskScore,
    };
  }

  /**
   * Evaluate plan quality via Critic agent
   */
  private async evaluatePlan(plan: unknown): Promise<{ score: number; feedback: string[] }> {
    const critic = this.getAgent(AgentPersona.CRITIC);
    try {
      const result = await critic.execute<{ score: number; feedback: string[] }>("Evaluate strategic plan", {
        plan,
      });
      return {
        score: Math.max(0, Math.min(100, (result as any).score ?? 50)),
        feedback: ((result as any).feedback as string[]) ?? ["No feedback available"],
      };
    } catch (error) {
      console.error("[MissionControl] Critic evaluation failed:", error);
      return { score: 50, feedback: ["Evaluation unavailable"] };
    }
  }

  /**
   * Format human-readable synthesis summary
   */
  private formatSynthesisSummary(
    goal: string,
    iterations: number,
    analysis: { feasibility?: number; notes?: string[] },
    _plan: unknown
  ): string {
    const feasibility = (analysis as any).feasibility ?? 85;
    const notes = ((analysis as any).notes as string[])?.slice(0, 2) ?? ["Analysis complete"];

    return [
      `🎯 **Strategic Synthesis Complete**`,
      `📋 Goal: ${goal.substring(0, 80)}${goal.length > 80 ? "..." : ""}`,
      `🔄 Iterations: ${iterations + 1}`,
      `📊 Feasibility: ${feasibility}%`,
      `✅ ${notes[0]}`,
      ...(notes.length > 1 ? [`💡 ${notes[1]}`] : []),
      `🚀 Ready for execution`,
    ].join("\n");
  }
}

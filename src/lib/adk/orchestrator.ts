import { A2UIMessage } from "./protocol";
import { BaseAgent, AgentPersona } from "./types";
import type { Plan } from "../../types";
import { AgentFactory } from "./factory";

/**
 * MissionControl: Central orchestrator for multi-agent collaborative synthesis.
 */
export class MissionControl {
  private agents: Map<AgentPersona, BaseAgent> = new Map();

  constructor() {
    this.agents.set(
      AgentPersona.STRATEGIST,
      AgentFactory.create(AgentPersona.STRATEGIST),
    );
    this.agents.set(
      AgentPersona.ANALYST,
      AgentFactory.create(AgentPersona.ANALYST),
    );
    this.agents.set(
      AgentPersona.CRITIC,
      AgentFactory.create(AgentPersona.CRITIC),
    );
  }

  private getAgent(persona: AgentPersona): BaseAgent {
    const agent = this.agents.get(persona);
    if (!agent) {
      throw new Error(`Agent not registered for persona: ${persona}`);
    }
    return agent;
  }

  async processCollaborativeInput(
    goal: string,
    context?: unknown,
  ): Promise<{ text: string; a2ui?: A2UIMessage }> {
    const strategist = this.getAgent(AgentPersona.STRATEGIST);
    const analyst = this.getAgent(AgentPersona.ANALYST);
    let proposal = await strategist.execute(goal, context);

    let attempts = 0;
    const maxAttempts = 2;
    while (attempts < maxAttempts) {
      const { score, feedback } = await this.evaluatePlan(proposal);
      if (score > 85) break;

      attempts++;
      const feedbackText = feedback.join(". ");
      proposal = await strategist.execute(
        `REVISE PLAN: ${goal}. Feedback: ${feedbackText}`,
        context,
      );
    }

    const ui = strategist.getInitialUI();
    const analysis = await analyst.execute("Verify grounding", proposal);

    return {
      text: `Synthesis concluded. Refined via ${attempts} iterations. Analysis: ${
        (analysis as { notes?: string }).notes ?? "No analysis notes."
      }`,
      a2ui: ui,
    };
  }

  async simulateFailure(
    plan: Plan,
    failedTaskId: string,
  ): Promise<{ cascade: string[]; riskScore: number }> {
    const cascade: string[] = [failedTaskId];
    const queue: string[] = [failedTaskId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const dependents = (plan.tasks ?? []).filter((t: SubTaskLike) =>
        t.dependencies?.includes(currentId),
      );

      for (const dep of dependents) {
        if (!cascade.includes(dep.id)) {
          cascade.push(dep.id);
          queue.push(dep.id);
        }
      }
    }

    const taskCount = plan.tasks?.length || 1;
    const riskScore = (cascade.length / taskCount) * 100;
    return { cascade, riskScore };
  }

  async evaluatePlan(
    plan: unknown,
  ): Promise<{ score: number; feedback: string[] }> {
    const critic = this.getAgent(AgentPersona.CRITIC);
    return critic.execute<{ score: number; feedback: string[] }>(
      "Evaluate plan risks",
      plan,
    );
  }
}

type SubTaskLike = {
  id: string;
  dependencies?: string[];
};

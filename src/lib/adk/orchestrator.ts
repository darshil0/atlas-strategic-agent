
import { A2UIMessage } from "./protocol";
import { BaseAgent, AgentPersona } from "./types";
import { AgentFactory } from "./factory";

/**
 * MissionControl: Central orchestrator for multi-agent collaborative synthesis.
 */
export class MissionControl {
    private agents: Map<AgentPersona, BaseAgent> = new Map();

    constructor() {
        this.agents.set(AgentPersona.STRATEGIST, AgentFactory.create(AgentPersona.STRATEGIST));
        this.agents.set(AgentPersona.ANALYST, AgentFactory.create(AgentPersona.ANALYST));
        this.agents.set(AgentPersona.CRITIC, AgentFactory.create(AgentPersona.CRITIC));
    }

    async processCollaborativeInput(goal: string, context?: any): Promise<{ text: string, a2ui?: A2UIMessage }> {
        const strategist = this.agents.get(AgentPersona.STRATEGIST)!;
        const analyst = this.agents.get(AgentPersona.ANALYST)!;

        // Proposal
        let proposal = await strategist.execute(goal, context);

        // Evaluation & Resolution
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
            const { score, feedback } = await this.evaluatePlan(proposal);
            if (score > 85) break;

            attempts++;
            proposal = await strategist.execute(`REVISE PLAN: ${goal}. Feedback: ${feedback.join(". ")}`, context);
        }

        const ui = strategist.getInitialUI();
        const analysis = await analyst.execute("Verify grounding", proposal);

        return {
            text: `Synthesis concluded. Refined via ${attempts} iterations. Analysis: ${analysis.notes}`,
            a2ui: ui
        };
    }

    async simulateFailure(plan: any, failedTaskId: string): Promise<{ cascade: string[], riskScore: number }> {
        const cascade: string[] = [failedTaskId];
        const queue = [failedTaskId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const dependents = (plan.tasks || []).filter((t: any) => t.dependencies?.includes(currentId));

            dependents.forEach((dep: any) => {
                if (!cascade.includes(dep.id)) {
                    cascade.push(dep.id);
                    queue.push(dep.id);
                }
            });
        }

        const taskCount = plan.tasks?.length || 1;
        const riskScore = (cascade.length / taskCount) * 100;
        return { cascade, riskScore };
    }

    async evaluatePlan(plan: any): Promise<{ score: number, feedback: string[] }> {
        const critic = this.agents.get(AgentPersona.CRITIC)!;
        return await critic.execute("Evaluate plan risks", plan);
    }
}

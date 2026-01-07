import { A2UIMessage } from "./protocol";
import { BaseAgent, AgentFactory } from "./index";

export enum AgentPersona {
    STRATEGIST = "Strategist",
    ANALYST = "Analyst",
    CRITIC = "Critic",
}

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

        // Phase 1: Proposal
        let proposal = await strategist.execute(goal, context);

        // Phase 2: Evaluation & Conflict Resolution Loop
        let attempts = 0;
        const maxAttempts = 2;
        let lastFeedback = "";

        while (attempts < maxAttempts) {
            const { score, feedback } = await this.evaluatePlan(proposal);
            if (score > 85) break;

            attempts++;
            lastFeedback = feedback.join(". ");
            console.log(`Conflict detected (Score: ${score}). Agent Critic requests revision: ${lastFeedback}`);

            // Re-prompt Strategist with Critic feedback
            proposal = await strategist.execute(`REVISE PLAN: ${goal}. Previous attempts failed Critic review. Feedback: ${lastFeedback}. Context: ${JSON.stringify(proposal)}`, context);
        }

        const ui = strategist.getInitialUI();

        // Final Analyst verification
        const analysis = await analyst.execute("Verify final strategic grounding", proposal);

        return {
            text: `Collaborative Synthesis concluded after ${attempts + 1} iterations. Strategist proposed a plan, which was refined by Critic feedback. Analyst verification: ${analysis.notes}.`,
            a2ui: ui
        };
    }

    /**
     * Simulation Engine: Predicts mission failure cascades
     */
    async simulateFailure(plan: any, failedTaskId: string): Promise<{ cascade: string[], riskScore: number }> {
        const cascade: string[] = [failedTaskId];
        const queue = [failedTaskId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const dependents = plan.tasks.filter((t: any) => t.dependencies?.includes(currentId));

            dependents.forEach((dep: any) => {
                if (!cascade.includes(dep.id)) {
                    cascade.push(dep.id);
                    queue.push(dep.id);
                }
            });
        }

        const riskScore = (cascade.length / plan.tasks.length) * 100;
        return { cascade, riskScore };
    }

    async evaluatePlan(plan: any): Promise<{ score: number, feedback: string[] }> {
        const critic = this.agents.get(AgentPersona.CRITIC)!;
        const evaluation = await critic.execute("Provide risk assessment score and feedback", plan);

        const feedback = evaluation.risks || [];
        let score = evaluation.score || 100;

        // Base structural checks
        if (!plan.tasks || plan.tasks.length === 0) {
            feedback.push("Plan contains no actionable tasks.");
            score = Math.min(score, 50);
        }

        return { score, feedback };
    }
}

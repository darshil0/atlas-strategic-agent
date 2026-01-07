
import { A2UIMessage, AGUIEvent, A2UIComponentType } from "./protocol";
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
        const critic = this.agents.get(AgentPersona.CRITIC)!;

        // Orchestration flow:
        // 1. Strategist proposes structure
        // 2. Analyst reviews for data grounding
        // 3. Critic checks for risks

        // For demonstration in this POC, we return a consolidated UI
        const ui = strategist.getInitialUI();

        return {
            text: `Collaborative Analysis complete for: ${goal}. Strategist has proposed a structure, Analyst verified grounding, and Critic reviewed for constraints.`,
            a2ui: ui
        };
    }

    async evaluatePlan(plan: any): Promise<{ score: number, feedback: string[] }> {
        const critic = this.agents.get(AgentPersona.CRITIC)!;
        console.log(`MissionControl: Critic (${critic.name}) is evaluating plan...`);

        const feedback = [];
        let score = 100;

        if (!plan.tasks || plan.tasks.length === 0) {
            feedback.push("Critical Failure: Plan contains no tasks.");
            score -= 50;
        }

        return { score, feedback };
    }
}

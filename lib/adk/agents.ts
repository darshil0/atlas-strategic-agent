
import { BaseAgent, UIBuilder } from "./index";
import { A2UIMessage, AGUIEvent, A2UIComponentType } from "./protocol";

export class StrategistAgent extends BaseAgent {
    name = "Strategist";
    description = "Specializes in goal decomposition and roadmap logic.";

    async handleEvent(event: AGUIEvent): Promise<A2UIMessage> {
        return new UIBuilder()
            .add(A2UIComponentType.TEXT, { text: `Strategist received: ${event.action}` })
            .build();
    }

    async execute(prompt: string, context?: any): Promise<any> {
        // In V3, this would call the Gemini API via AtlasService
        console.log(`Strategist executing: ${prompt}`);
        return context || { plan: "Draft Strategy" };
    }

    getInitialUI(): A2UIMessage {
        return new UIBuilder()
            .add(A2UIComponentType.TEXT, { text: "Strategist Ready." })
            .build();
    }
}

export class AnalystAgent extends BaseAgent {
    name = "Analyst";
    description = "Focuses on data grounding and feasibility analysis.";

    async handleEvent(event: AGUIEvent): Promise<A2UIMessage> {
        return new UIBuilder()
            .add(A2UIComponentType.CHART, { title: "Feasibility Score", data: [{ label: "Risk", value: 30 }, { label: "Confidence", value: 85 }] })
            .build();
    }

    async execute(prompt: string, context?: any): Promise<any> {
        console.log(`Analyst executing: ${prompt}`);
        return { feasibility: 0.9, notes: "Verified grounding context." };
    }

    getInitialUI(): A2UIMessage {
        return new UIBuilder()
            .add(A2UIComponentType.TEXT, { text: "Analyst Ready." })
            .build();
    }
}

export class CriticAgent extends BaseAgent {
    name = "Critic";
    description = "Reviews plans for risks and identifies missing dependencies.";

    async handleEvent(event: AGUIEvent): Promise<A2UIMessage> {
        return new UIBuilder()
            .add(A2UIComponentType.CARD, { title: "Risk Report", children: [] })
            .build();
    }

    async execute(prompt: string, context?: any): Promise<any> {
        console.log(`Critic executing: ${prompt}`);
        return { score: 90, risks: [] };
    }

    getInitialUI(): A2UIMessage {
        return new UIBuilder()
            .add(A2UIComponentType.TEXT, { text: "Critic Ready." })
            .build();
    }
}

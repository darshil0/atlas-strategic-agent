
import { A2UIMessage, A2UIElement, AGUIEvent, A2UIComponentType } from './protocol';

/**
 * Base Agent Development Kit (ADK)
 * Provides the framework for building A2UI-compliant agents.
 */

export abstract class BaseAgent {
    abstract name: string;
    abstract description: string;

    /**
     * Processes an incoming event from the UI via AG-UI protocol.
     */
    abstract handleEvent(event: AGUIEvent): Promise<A2UIMessage>;

    /**
     * Generates an initial UI state.
     */
    abstract getInitialUI(): A2UIMessage;
}

export class UIBuilder {
    private elements: A2UIElement[] = [];

    add(type: A2UIComponentType, props: Record<string, any>, id?: string): UIBuilder {
        this.elements.push({
            id: id || Math.random().toString(36).substring(7),
            type,
            props
        });
        return this;
    }

    build(version: string = "0.8"): A2UIMessage {
        return {
            version,
            elements: [...this.elements]
        };
    }
}

export interface AgentContext {
    sessionId: string;
    metadata: Record<string, any>;
}

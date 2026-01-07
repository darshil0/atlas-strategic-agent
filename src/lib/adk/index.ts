
import { A2UIMessage, A2UIElement, A2UIComponentType } from './protocol';

/**
 * UIBuilder: Fluent interface for creating A2UI-compliant JSON payloads.
 */
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

/**
 * Re-export core ADK logic
 */
export * from './types';
export * from './orchestrator';
export * from './agents';
export * from './protocol';
export * from './exporter';
export * from './factory';

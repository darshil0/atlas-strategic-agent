
/**
 * A2UI (Agent-to-User Interface) Protocol Specification v0.8 (Simplified)
 * Standardizing how AI agents communicate native UI components.
 */

export enum A2UIComponentType {
    CONTAINER = 'container',
    TEXT = 'text',
    BUTTON = 'button',
    INPUT = 'input',
    CARD = 'card',
    LIST = 'list',
    CHART = 'chart',
    PROGRESS = 'progress',
    CHECKBOX = 'checkbox',
    SELECT = 'select',
}

export interface A2UIMessage {
    version: string;
    elements: A2UIElement[];
}

export interface A2UIElement {
    id: string;
    type: A2UIComponentType;
    props: Record<string, any>;
    children?: A2UIElement[];
}

/**
 * AG-UI (Agent-User Interaction) Protocol
 * Transport and state management for A2UI.
 */

export interface AGUIEvent {
    elementId: string;
    action: string;
    data?: any;
    timestamp: number;
}

export interface AGUISession {
    id: string;
    agentId: string;
    history: A2UIMessage[];
}

export function validateA2UIMessage(data: any): A2UIMessage | null {
    if (!data || typeof data !== 'object') return null;
    if (!data.version || !Array.isArray(data.elements)) return null;

    // Basic structural validation
    const validElements = data.elements.filter((el: any) => {
        return el && typeof el === 'object' && el.id && el.type;
    });

    return {
        version: data.version,
        elements: validElements as A2UIElement[]
    };
}

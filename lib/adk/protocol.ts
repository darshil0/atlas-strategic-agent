
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

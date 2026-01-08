 * A2UI (Agent-to-User Interface) Protocol Specification v0.8 (Simplified)
 * Standardizing how AI agents communicate native UI components.
 */

export enum A2UIComponentType {
  CONTAINER = "container",
  TEXT = "text",
  BUTTON = "button",
  INPUT = "input",
  CARD = "card",
  LIST = "list",
  CHART = "chart",
  PROGRESS = "progress",
  CHECKBOX = "checkbox",
  SELECT = "select",
}

export type A2UIProps = Record<string, any>;
export type A2UIProps = Record<string, unknown>;
export interface A2UIMessage {
  version: string;
  elements: A2UIElement[];
}

export interface A2UIElement {
  id: string;
  type: A2UIComponentType;
  props: A2UIProps;
  children?: A2UIElement[];
}

/**
 * AG-UI (Agent-User Interaction) Protocol
 * Transport and state management for A2UI.
 */

export interface AGUIEvent {
  elementId: string;
  action: string;
  data?: unknown;
  timestamp: number;
}

export interface AGUISession {
  id: string;
  agentId: string;
  history: A2UIMessage[];
}

export function validateA2UIMessage(data: unknown): A2UIMessage | null {
  if (!data || typeof data !== "object") return null;

  const msg = data as Partial<A2UIMessage>;
  if (!msg.version || !Array.isArray(msg.elements)) return null;

  const validElements: A2UIElement[] = msg.elements
    .filter(
      (el: unknown): el is A2UIElement =>
        !!el &&
        typeof el === "object" &&
        typeof (el as A2UIElement).id === "string" &&
        typeof (el as A2UIElement).type === "string",
    )
    .map((el) => el as A2UIElement);

  return {
    version: msg.version,
    elements: validElements,
  };
}

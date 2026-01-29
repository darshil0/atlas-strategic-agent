import { AgentPersona } from "./types";

/**
 * A2UI (Agent-to-User Interface) Protocol Specification v1.0
 * Type-safe contract between Atlas agents and React renderer.
 * Powers Strategist/Analyst/Critic agent UIs.
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

/**
 * Component-specific props with common fields
 */
export interface BaseProps {
  id?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  children?: A2UIElement[];
}

export type A2UIProps = Record<string, unknown> & BaseProps;

// === COMPONENT PROPS INTERFACES ===
export interface TextProps extends BaseProps {
  text: string;
}

export interface ButtonProps extends BaseProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  actionData?: unknown;
}

export interface CardProps extends BaseProps {
  title?: string;
}

export interface ProgressProps extends BaseProps {
  label: string;
  value: number; // 0-100
}

export interface InputProps extends BaseProps {
  label?: string;
  placeholder?: string;
  inputType?: string;
  value?: string;
}

export interface ChartProps extends BaseProps {
  title: string;
  data: { label: string; value: number }[];
  maxValue?: number;
}

export interface ListProps extends BaseProps {
  items: { label: string; value?: string; icon?: string }[];
}

// === CORE INTERFACES ===
export interface A2UIMessage {
  version: "1.0";
  timestamp: number;
  elements: A2UIElement[];
}

export interface A2UIElement {
  id: string;
  type: A2UIComponentType;
  props: A2UIProps;
  children?: A2UIElement[];
}

/**
 * AGUI (Agent-GUI Interaction) Events
 * Standardized events from A2UIRenderer → Agents
 */
export interface AGUIEvent {
  elementId: string;
  action: string; // "click", "input_blur", "input_submit", "item_click", etc.
  data?: unknown;
  timestamp: number;
  sessionId?: string;
}

export interface AGUISession {
  id: string;
  agentId: string | AgentPersona;
  history: A2UIMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Production-grade message validation and sanitization
 */
export function validateA2UIMessage(data: unknown): A2UIMessage | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const msg = data as Partial<A2UIMessage>;

  // Version check
  if (msg.version !== "1.0") {
    console.warn(`[A2UI] Version mismatch: expected "1.0", got "${msg.version}"`);
    return null;
  }

  // Elements validation
  if (!Array.isArray(msg.elements)) {
    return null;
  }

  const validElements: A2UIElement[] = msg.elements
    .filter((el) => {
      if (!el || typeof el !== "object" || Array.isArray(el)) return false;

      const element = el as Partial<A2UIElement>;
      return (
        typeof element.id === "string" &&
        element.id.length > 0 &&
        typeof element.type === "string" &&
        Object.values(A2UIComponentType).includes(element.type as A2UIComponentType) &&
        typeof element.props === "object" &&
        element.props !== null
      );
    })
    .map((el: A2UIElement) => ({
      id: el.id,
      type: el.type,
      props: { ...el.props }, // Defensive copy
      children: el.children || [],
    }))
    .filter((el) => el.children?.every(isValidElement));

  if (validElements.length === 0) {
    return null;
  }

  return {
    version: "1.0",
    timestamp: Date.now(),
    elements: validElements,
  };
}

/**
 * Recursive element validation helper
 */
function isValidElement(el: unknown): el is A2UIElement {
  if (!el || typeof el !== "object" || Array.isArray(el)) return false;

  const element = el as Partial<A2UIElement>;
  if (
    typeof element.id !== "string" ||
    !element.id ||
    typeof element.type !== "string" ||
    !Object.values(A2UIComponentType).includes(element.type as A2UIComponentType)
  ) {
    return false;
  }

  if (!element.props || typeof element.props !== "object") {
    return false;
  }

  // Validate children recursively
  if (Array.isArray(element.children)) {
    return element.children.every(isValidElement);
  }

  return true;
}

/**
 * Type guard for safe element access
 */
export function isValidA2UIElement(el: unknown): el is A2UIElement {
  return isValidElement(el);
}

/**
 * Protocol version constants
 */
export const A2UI_PROTOCOL_VERSION = "1.0" as const;

/**
 * A2UI (Agent-to-User Interface) Protocol v1.1.2 - Glassmorphic Edition
 * Type-safe contract for Atlas agent swarm ↔ React glassmorphic renderer
 * Powers Strategist/Analyst/Critic UIs in your 2026 roadmap planner
 */

import { AgentPersona } from "@lib/adk/types"; // Fixed path alias

/**
 * Glassmorphic Component Primitives - A2UIRenderer ready
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
 * Base props with glassmorphic + accessibility support
 */
export interface BaseProps {
  id?: string;
  className?: string;           // Tailwind glass-* classes
  ariaLabel?: string;
  disabled?: boolean;
  variant?: "glass" | "primary" | "secondary" | "danger";
  children?: A2UIElement[];
}

/**
 * Component-specific glassmorphic props
 */
export type A2UIProps = Record<string, unknown> & BaseProps;

// === GLASSMORPHIC COMPONENT PROPS ===
export interface TextProps extends BaseProps {
  text: string;
  size?: "xs" | "sm" | "base" | "lg"; // font-* matching your system
}

export interface ButtonProps extends BaseProps {
  label: string;
  variant?: "primary" | "glass" | "secondary" | "danger";
  actionData?: unknown;
  loading?: boolean;
}

export interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
}

export interface ProgressProps extends BaseProps {
  label: string;
  value: number; // 0-100
  showPercentage?: boolean;
}

export interface InputProps extends BaseProps {
  label?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "number";
  value?: string;
}

export interface ChartProps extends BaseProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  maxValue?: number;
}

export interface ListProps extends BaseProps {
  items: Array<{
    label: string;
    value?: string;
    icon?: string;        // Lucide icon name
    selected?: boolean;
  }>;
}

// === CORE PROTOCOL INTERFACES ===
export interface A2UIMessage {
  version: "1.1";              // Glassmorphic edition
  timestamp: number;
  sessionId?: string;
  elements: A2UIElement[];
}

export interface A2UIElement {
  id: string;
  type: A2UIComponentType;
  props: A2UIProps;
  children?: A2UIElement[];
}

/**
 * Agent → Renderer Events (glassmorphic interactions)
 */
export interface AGUIEvent {
  elementId: string;
  action: AGUIAction;           // Typed actions
  data?: unknown;
  timestamp: number;
  sessionId?: string;
  agentPersona?: AgentPersona;  // Which agent triggered
}

export type AGUIAction =
  | "click"
  | "input_blur"
  | "input_submit"
  | "input_change"
  | "item_click"
  | "toggle"
  | "select_change"
  | "task_select"
  | "decompose"
  | "export_github"
  | "export_jira"
  | "sync_github"
  | "sync_jira";

/**
 * Agent session tracking
 */
export interface AGUISession {
  id: string;
  agentId: AgentPersona | string;
  goal: string;                 // Original strategic goal
  history: A2UIMessage[];
  createdAt: number;
  updatedAt: number;
  status: "planning" | "analyzing" | "reviewing" | "complete";
}

/**
 * Production-grade validation + sanitization
 */
export function validateA2UIMessage(data: unknown): A2UIMessage | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const msg = data as Partial<A2UIMessage>;

  // Protocol version (glassmorphic edition)
  if (msg.version !== "1.1" && msg.version !== "1.0") {
    console.warn(`[A2UI] Version mismatch: expected "1.1", got "${msg.version}"`);
    return null;
  }

  // Elements array validation
  if (!Array.isArray(msg.elements) || msg.elements.length === 0) {
    return null;
  }

  const validElements: A2UIElement[] = msg.elements
    .filter(validateElement)
    .map(sanitizeElement);

  if (validElements.length === 0) {
    return null;
  }

  return {
    version: "1.1",
    timestamp: Date.now(),
    elements: validElements,
  };
}

function validateElement(el: unknown): el is Partial<A2UIElement> {
  if (!el || typeof el !== "object" || Array.isArray(el)) return false;

  const element = el as Partial<A2UIElement>;
  return (
    typeof element.id === "string" && element.id.length > 0 &&
    typeof element.type === "string" &&
    Object.values(A2UIComponentType).includes(element.type as A2UIComponentType) &&
    typeof element.props === "object" && element.props !== null &&
    (!element.children || Array.isArray(element.children))
  );
}

function sanitizeElement(el: Partial<A2UIElement>): A2UIElement {
  return {
    id: el.id || `a2ui-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: el.type!,
    props: {
      ...el.props,
      className: (el.props as any)?.className || "glass-2", // Default glassmorphic
      variant: (el.props as any)?.variant || "glass",
    },
    children: el.children?.filter(validateElement).map(sanitizeElement) || [],
  };
}

/**
 * Type guards for safe runtime access
 */
export function isValidA2UIElement(el: unknown): el is A2UIElement {
  return validateElement(el);
}

export function isValidA2UIMessage(msg: unknown): msg is A2UIMessage {
  return !!validateA2UIMessage(msg);
}

/**
 * Protocol constants matching your glassmorphic system
 */
export const A2UI_PROTOCOL_VERSION = "1.1" as const;
export const GLASSMORPHIC_DEFAULTS = {
  className: "glass-2 backdrop-blur-3xl",
  variant: "glass" as const,
} as const;

/**
 * Quick glassmorphic message builder (convenience)
 */
export const createGlassMessage = (elements: A2UIElement[]): A2UIMessage => ({
  version: A2UI_PROTOCOL_VERSION,
  timestamp: Date.now(),
  elements,
});

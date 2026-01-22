/**
 * ATLAS Core Types (v3.2.1) - Production Type System
 * Comprehensive typing for MissionControl ADK, ReactFlow, GitHub/Jira sync
 * Enterprise-grade 2026 strategic planning with glassmorphic A2UI protocol
 */

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  BLOCKED = "BLOCKED",
  WAITING = "WAITING",
}

export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface Citation {
  uri: string;
  title?: string;
  excerpt?: string;
  confidence?: number;
}

export interface SubTask {
  id: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category?: string;        // "2026 Q1", "2026 Q2", etc.
  theme?: string;          // "AI", "Cyber", "Infra", "Growth"
  result?: string;
  dependencies?: string[];
  citations?: Citation[];
  parentId?: string;
  duration?: string;       // "2w", "1d", "4h"
  output?: string;
  assignee?: string;       // GitHub username
  labels?: string[];       // ["atlas-strategic", "q1-critical"]
  quarter?: "Q1" | "Q2" | "Q3" | "Q4"; // 2026 quarters
  estimatedEffort?: number; // story points
}

export interface Plan {
  id?: string;
  name?: string;
  projectName: string;
  goal: string;
  tasks: SubTask[];
  groundingData?: string[];
  metadata?: {
    created: number;
    updated: number;
    version: string;
    q1HighPriorityCount: number;
    totalEffort: number;
  };
  validation?: {
    qualityScore: number;
    iterations: number;
    agentConsensus: boolean;
  };
}

export type MessageRole = "user" | "assistant" | "system" | "agent";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  a2ui?: string;           // JSON-stringified A2UIMessage
  agentPersona?: string;   // "STRATEGIST", "ANALYST", "CRITIC"
  citations?: Citation[];
}

// === AGENT DEVELOPMENT KIT (ADK) ===
export enum AgentPersona {
  STRATEGIST = "STRATEGIST",
  ANALYST = "ANALYST",
  CRITIC = "CRITIC",
  ARCHITECT = "ARCHITECT",
}

export enum AgentMode {
  AUTONOMOUS = "AUTONOMOUS",
  COLLABORATIVE = "COLLABORATIVE",
  SUPERVISED = "SUPERVISED",
}

export interface AgentResponse {
  text: string;
  a2ui?: A2UIMessage;
  validation?: {
    iterations: number;
    finalScore: number;
    graphReady: boolean;
    q1HighCount: number;
  };
}

// === A2UI GLASSMORPHIC PROTOCOL ===
export interface A2UIMessage {
  version: "1.1";
  elements: A2UIElement[];
  timestamp: number;
}

export type A2UIElement = 
  | A2UIPanel 
  | A2UICard 
  | A2UIButton 
  | A2UIProgress 
  | A2UIStat;

interface A2UIElementBase {
  type: string;
  id: string;
  className?: string;
}

export interface A2UIPanel extends A2UIElementBase {
  type: "panel";
  title: string;
  variant?: "info" | "success" | "warning" | "error";
  children: A2UIElement[];
}

export interface A2UICard extends A2UIElementBase {
  type: "card";
  title: string;
  subtitle?: string;
  children: A2UIElement[];
}

export interface A2UIButton extends A2UIElementBase {
  type: "button";
  label: string;
  actionData: string;     // "sync_github", "decompose_task"
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
}

export interface A2UIProgress extends A2UIElementBase {
  type: "progress";
  label: string;
  value: number;
  max?: number;
}

export interface A2UIStat extends A2UIElementBase {
  type: "stat";
  label: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
}

// === ENTERPRISE INTEGRATION ===
export interface GithubIssueResult {
  success: boolean;
  issueNumber?: number;
  htmlUrl?: string;
  taskId?: string;
  error?: string;
}

export interface JiraTicketResult {
  success: boolean;
  issueKey?: string;
  issueId?: string;
  webUrl?: string;
  taskId?: string;
  error?: string;
}

export interface SyncResult {
  github: GithubSyncResult | null;
  jira: JiraSyncResult | null;
  totalCreated: number;
  timestamp: string;
}

export interface GithubSyncResult {
  created: number;
  skipped: number;
  failed: GithubIssueResult[];
  epics: Record<string, string>;
}

export interface JiraSyncResult {
  created: number;
  skipped: number;
  failed: JiraTicketResult[];
  epics: Record<string, string>;
}

// === TASKBANK SYSTEM ===
export interface BankTask {
  id: string;
  description: string;
  priority: Priority;
  category: string;
  theme: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  effort: number;        // story points
  dependencies: string[];
}

// === A2UI EVENT PROTOCOL ===
export interface AGUIEvent {
  action: string;        // "sync_github", "task_decompose"
  elementId: string;
  payload?: Record<string, any>;
  timestamp: number;
}

// === REACT COMPONENT PROPS ===
export interface TaskCardProps {
  task: SubTask;
  isActive: boolean;
  isBlocked: boolean;
  onClick: (id: string) => void;
  onDecompose: (id: string) => void;
  onExport: (id: string, type: "github" | "jira") => Promise<void>;
  exported?: { github?: string; jira?: string };
  onSimulateFailure?: (id: string) => Promise<void>;
}

export interface DependencyGraphProps {
  tasks: SubTask[];
  activeTaskId?: string | null;
  onTaskSelect: (id: string) => void;
  isTaskBlocked: (task: SubTask, allTasks: SubTask[]) => boolean;
  onConnect: (source: string, target: string) => void;
  isWhatIfEnabled: boolean;
  simulationResult?: {
    cascade: string[];
    riskScore: number;
    impactedHighPriority: number;
  } | null;
  onSimulateFailure: (taskId: string) => Promise<void>;
}

// === PERSISTENCE TYPES ===
export interface PersistenceConfig {
  github: {
    apiKey: string;
    owner: string;
    repo: string;
  } | null;
  jira: {
    apiKey: string;
    domain: string;
    projectKey: string;
    email: string;
  } | null;
}

// === UTILITY TYPES ===
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type Theme = "AI" | "Cyber" | "Infra" | "Growth" | "Ops" | "Legal";


export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  FAILED = "failed",
  BLOCKED = "blocked",
  WAITING = "waiting",
}

export enum Priority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export interface Citation {
  uri: string;
  title?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  successCriteria: string;
  isReached: boolean;
}

export interface SubTask {
  id: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category?: string;
  result?: string;
  dependencies?: string[];
  citations?: Citation[];
  parentId?: string;
  duration?: string;
  output?: string;
}

export interface Plan {
  projectName: string;
  timeline: string;
  goal: string;
  tasks: SubTask[];
  milestones?: Milestone[];
  criticalPath?: string[];
}

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  a2ui?: string;
}

export enum AgentMode {
  AUTONOMOUS = "Autonomous",
  COLLABORATIVE = "Collaborative",
  GUIDED = "Guided",
}

export interface AgentState {
  currentPlan: Plan | null;
  activeTaskId: string | null;
  mode: AgentMode;
  isThinking: boolean;
}

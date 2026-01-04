export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  WAITING = 'waiting'
}

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Citation {
  uri: string;
  title?: string;
}

export interface SubTask {
  id: string;
  description: string;
  status: TaskStatus;
  priority?: Priority;
  category?: string;
  result?: string;
  dependencies?: string[];
  citations?: Citation[];
  parentId?: string;
  progress?: number;
}

export interface Plan {
  goal: string;
  tasks: SubTask[];
  criticalPath?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export enum AgentMode {
  AUTONOMOUS = 'Autonomous',
  COLLABORATIVE = 'Collaborative',
  GUIDED = 'Guided'
}

export interface AgentState {
  currentPlan: Plan | null;
  activeTaskId: string | null;
  mode: AgentMode;
  isThinking: boolean;
}
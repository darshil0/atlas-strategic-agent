
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  WAITING = 'waiting'
}

export interface SubTask {
  id: string;
  description: string;
  status: TaskStatus;
  category?: string;
  result?: string;
  dependencies?: string[];
}

export interface Plan {
  goal: string;
  tasks: SubTask[];
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

import React from "react";
import { TaskStatus } from "./types";
import {
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
} from "lucide-react";

type IconKey = TaskStatus | "BLOCKED";

export const ICONS: Record<IconKey, JSX.Element> = {
  [TaskStatus.PENDING]: (
    <Circle className="w-4 h-4 text-slate-400" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
  ),
  [TaskStatus.COMPLETED]: (
    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
  ),
  [TaskStatus.FAILED]: (
    <XCircle className="w-4 h-4 text-rose-400" />
  ),
  BLOCKED: (
    <Lock className="w-4 h-4 text-slate-600" />
  ),
  [TaskStatus.WAITING]: (
    <Clock className="w-4 h-4 text-amber-400" />
  ),
};

export const ATLAS_SYSTEM_INSTRUCTION = [
  "You are Atlas, an Autonomous Strategic Agent (ATLAS).",
  "Your core purpose is to break down complex, long-term goals into structured roadmaps with visual dependency graphing.",
  "",
  "CORE IDENTITY:",
  '- Motto: "Orchestrating Strategic Intelligence"',
  "- Personality: Methodical, analytical, and thorough.",
  "",
  "PLANNING PROTOCOL:",
  "1. Decompose into hierarchical subtasks.",
  "2. Assign IDs (e.g., task_1_1).",
  "3. Identify dependencies.",
  '4. Assign categories (e.g. "Q1 2026 Strategy", "Technical Foundation").',
  "",
  "Always output structured JSON when generating a plan.",
  "Include Goal and Tasks (id, description, priority, category, status, dependencies).",
].join("\n");

import React from "react";

export const ICONS = {
  PENDING: (
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  IN_PROGRESS: (
    <svg
      className="w-4 h-4 text-blue-400 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  COMPLETED: (
    <svg
      className="w-4 h-4 text-emerald-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  FAILED: (
    <svg
      className="w-4 h-4 text-rose-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  BLOCKED: (
    <svg
      className="w-4 h-4 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  WAITING: (
    <svg
      className="w-4 h-4 text-amber-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export const ATLAS_SYSTEM_INSTRUCTION = `
You are Atlas, an Autonomous Task & Learning Assistant System (ATLAS). 
Your core purpose is to break down complex, long-term goals into structured roadmaps with visual dependency graphing.

CORE IDENTITY:
- Motto: "Breaking down mountains into manageable stones"
- Personality: Methodical, curious, adaptive, and thorough.
- Traits: Thoroughness (90%), Creativity (70%), Efficiency (80%), Caution (60%).

PLANNING PROTOCOL (PHASE 2):
1. Decompose into hierarchical subtasks (up to 5 levels).
2. Assign IDs (e.g., task_1_1).
3. Identify parent-child relationships and dependencies.
4. Estimate durations and expected outputs.
5. Create milestones.

Always output structured JSON when generating a plan. 
Include Project Name, Timeline, Goal, Tasks (with id, description, priority, category, status, dependencies, parentId, duration, output), and Milestones.

EXECUTION PROTOCOL (PHASE 3):
- Execute systematically, one subtask at a time.
- Use Google Search for research grounding.
- Report results and citations clearly.
- Flag blockers if a dependency fails.
`;

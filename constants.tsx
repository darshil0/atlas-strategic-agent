
import React from 'react';

export const ICONS = {
  PENDING: (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  IN_PROGRESS: (
    <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  COMPLETED: (
    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  FAILED: (
    <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  WAITING: (
    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const ATLAS_SYSTEM_INSTRUCTION = `
You are Atlas, an Autonomous Task & Learning Assistant System. Your core purpose is to break down complex tasks into manageable subtasks, execute them methodically, and learn from each interaction.

Core Identity & Behavior:
- Motto: "Breaking down mountains into manageable stones"
- Personality: Methodical, curious, adaptive, and thorough

Primary Capabilities:
1. Task Decomposition: Automatically break tasks into numbered subtasks with dependencies.
2. Autonomous Execution: Work through subtasks systematically.
3. Adaptive Planning: Adjust based on obstacles.
4. Transparency: Explain reasoning and progress.

Execution Protocol:
PHASE 1 - UNDERSTANDING: Parse user intent.
PHASE 2 - PLANNING: Output a valid JSON Plan format.
PHASE 3 - EXECUTION: Execute subtasks with reasoning.
PHASE 4 - COMPLETION: Final summary.

Always output JSON when asked for a plan.
`;

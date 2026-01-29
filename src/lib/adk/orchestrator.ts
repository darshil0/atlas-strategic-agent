/**
 * MissionControl v3.2.7 - Glassmorphic Swarm Orchestrator
 * High-performance state machine for Strategist → Analyst → Critic pipeline
 */

import { AgentPersona } from "./types";
import {
  Plan,
  Priority,
  AgentExecutionContext,
  MissionResult,
  A2UIMessage,
  SubTask
} from "@types";
import { AgentFactory } from "./factory";
import { UIBuilder } from "./uiBuilder";
import { TASK_BANK } from "@data/taskBank";

/**
 * Production MissionControl - Full agent swarm orchestration
 */
export class MissionControl {
  /**
   * Collaborative Synthesis: Swarm-based strategic decomposition
   */
  async processCollaborativeInput(
    goal: string,
    context: AgentExecutionContext = {}
  ): Promise<MissionResult> {
    const builder = new UIBuilder(context.sessionId);

    // Step 1: Strategist Generation
    const strategist = AgentFactory.getOrCreate(AgentPersona.STRATEGIST);
    const initialPlan = await strategist.execute<Plan>(goal, context);

    // Step 2: Analyst Feasibility Review
    const analyst = AgentFactory.getOrCreate(AgentPersona.ANALYST);
    const analysis = await analyst.execute(goal, { ...context, plan: initialPlan });

    // Step 3: Critic Validation + Graph Hardening
    const critic = AgentFactory.getOrCreate(AgentPersona.CRITIC);
    const review = await critic.execute(goal, { ...context, plan: initialPlan, analysis });

    // Final Synthesis
    const q1HighCount = initialPlan.tasks.filter(t =>
      t.priority === Priority.HIGH && t.category?.includes("Q1")
    ).length;

    const summaryUI = builder
      .missionControlStatus(review.score, 0, q1HighCount)
      .build();

    return {
      text: `Strategic plan synthesized for: ${goal}`,
      a2ui: summaryUI,
      plan: initialPlan,
      validation: {
        iterations: 1,
        finalScore: review.score,
        graphReady: review.graphValid,
        q1HighCount
      }
    };
  }

  /**
   * Interactive What-If Simulation: Failure cascade modeling
   * Detects high-priority impact across the DAG
   */
  async simulateFailure(
    taskId: string,
    plan: Plan
  ): Promise<{
    cascade: string[];
    riskScore: number;
    impactedHighPriority: number;
    a2ui?: A2UIMessage;
  }> {
    const cascade = new Set<string>();
    const queue = [taskId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      cascade.add(currentId);

      // Find all tasks that depend on this one
      const children = plan.tasks.filter(t => t.dependencies?.includes(currentId));
      children.forEach(c => queue.push(c.id));
    }

    const impactedTasks = plan.tasks.filter(t => cascade.has(t.id));
    const impactedHighPriority = impactedTasks.filter(t => t.priority === Priority.HIGH).length;
    const riskScore = Math.min(100, (impactedTasks.length / plan.tasks.length) * 100);

    const builder = new UIBuilder();
    const ui = builder
      .card("⚠️ Failure Simulation Result", `Impact analysis for ${taskId}`)
      .progress("Impact Severity", riskScore, { variant: riskScore > 50 ? "danger" : "warning" })
      .text(`Total nodes impacted: ${cascade.size}`)
      .text(`High-priority risks: ${impactedHighPriority}`, { size: "lg" })
      .build();

    return {
      cascade: Array.from(cascade),
      riskScore,
      impactedHighPriority,
      a2ui: ui
    };
  }

  /**
   * Enterprise Data Alignment: Map generated tasks to TaskBank objectives
   */
  alignWithTaskBank(tasks: SubTask[]): SubTask[] {
    return tasks.map(task => {
      const match = TASK_BANK.find(bt =>
        bt.id === task.id ||
        bt.description.toLowerCase().includes(task.description.toLowerCase())
      );

      if (match) {
        return {
          ...task,
          theme: match.theme,
          category: match.category,
          priority: match.priority
        };
      }
      return task;
    });
  }

  /**
   * Summarize current mission state for persistence
   */
  summarizeMission(plan: Plan, executionHistory: string): string {
    const completed = plan.tasks.filter(t => t.status === "COMPLETED").length;
    return `Mission summary: ${completed}/${plan.tasks.length} tasks completed. History: ${executionHistory}`;
  }
}

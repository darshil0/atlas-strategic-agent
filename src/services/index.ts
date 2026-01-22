/**
 * Atlas Integration Hub (v3.2.3) - Glassmorphic Sync Orchestrator
 * Single import for GitHub Issues + Jira Tickets bidirectional sync
 */

import { GithubService } from "@services/githubService";
import { JiraService } from "@services/jiraService";
import { PersistenceService } from "@services/persistenceService";
import { AtlasService } from "@services/geminiService";
import { TaskStatus, Priority } from "@types";
import type { Plan } from "@types";

/**
 * Production singleton services
 */
export const githubService = new GithubService();
export const jiraService = new JiraService();

/**
 * Unified sync orchestrator for enterprise PM tools
 */
export const syncServices = {
  /**
   * One-click sync: Atlas Plan → GitHub + Jira
   */
  syncToAll: async (plan: Plan): Promise<any> => {
    const [githubResult, jiraResult] = await Promise.allSettled([
      githubService.syncPlan(plan.tasks),
      jiraService.syncPlan(plan.tasks),
    ]);

    return {
      github: (githubResult.status === "fulfilled" ? githubResult.value : null),
      jira: (jiraResult.status === "fulfilled" ? jiraResult.value : null),
      totalCreated: (githubResult.status === "fulfilled" ? githubResult.value.created : 0) +
        (jiraResult.status === "fulfilled" ? jiraResult.value.created : 0),
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Bidirectional sync: Pull updates from GitHub/Jira
   */
  pullUpdates: async (plan: Plan): Promise<Plan> => {
    const owner = PersistenceService.getGithubOwner();
    const repo = PersistenceService.getGithubRepo();

    if (!owner || !repo) return plan;

    const [githubTasks, jiraTasks] = await Promise.allSettled([
      githubService.importPlan(owner, repo),
      jiraService.importPlan(),
    ]);

    const externalTasks = [
      ...(githubTasks.status === "fulfilled" ? githubTasks.value : []),
      ...(jiraTasks.status === "fulfilled" ? jiraTasks.value : []),
    ];

    const updatedTasks = plan.tasks.map(task => {
      const externalMatch = externalTasks.find(et => et.id === task.id);
      if (externalMatch) {
        return { ...task, status: externalMatch.status };
      }
      return task;
    });

    return { ...plan, tasks: updatedTasks };
  },

  /**
   * Health check all services
   */
  healthCheck: async (): Promise<any[]> => {
    const checks = await Promise.allSettled([
      githubService.createIssue({ id: "HEALTH-CHECK", description: "Test", status: TaskStatus.PENDING, priority: Priority.LOW, category: "2026 Q1" }),
      jiraService.createTicket({ id: "HEALTH-CHECK", description: "Test", status: TaskStatus.PENDING, priority: Priority.LOW, category: "2026 Q1" }),
    ]);

    return checks.map((check, i) => ({
      service: i === 0 ? "GitHub" : "Jira",
      healthy: check.status === "fulfilled",
      timestamp: new Date().toISOString(),
    }));
  },
};

/**
 * Enterprise workflow presets
 */
export const enterpriseWorkflows = {
  /**
   * 2026 Roadmap → GitHub Project + Jira Epic sync
   */
  sync2026Roadmap: async (plan: Plan): Promise<void> => {
    await syncServices.syncToAll(plan);

    const summary = await AtlasService.summarizeMission(
      plan,
      "Full enterprise sync complete across GitHub Issues and Jira Cloud."
    );

    console.log("🏛️ [Enterprise Sync] 2026 Roadmap deployed:", summary);
  },

  /**
   * GitHub PR → Jira transition automation trigger
   */
  setupWorkflowAutomation: async (): Promise<void> => {
    const workflow = `\
name: Atlas Strategic Sync
on:
  pull_request:
    types: [opened, synchronize, closed]
jobs:
  sync-jira:
    runs-on: ubuntu-latest
    steps:
      - uses: atlas-corp/atlas-sync-action@v3.2.3
        with:
          jira-project: ATLAS2026
`;

    await PersistenceService.saveWorkflow(workflow);
  },
};

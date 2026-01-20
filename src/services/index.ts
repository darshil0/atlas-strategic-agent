/**
 * Atlas Integration Hub (v3.2.1) - Glassmorphic Sync Orchestrator
 * Single import for GitHub Issues + Jira Tickets bidirectional sync
 * MissionControl → ReactFlow → GitHub/Jira enterprise pipeline
 * 
 * Usage: `import { syncServices, githubService, jiraService } from '@/services/sync'`
 */

import { GithubService } from "@services/githubService";
import { JiraService } from "@services/jiraService";
import { PersistenceService } from "@services/persistenceService";
import { ENV } from "@config";
import { TaskStatus, Priority } from "@types";
import type { Plan, SubTask, A2UIMessage } from "@types";
import { MissionControl } from "@lib/adk/orchestrator";
import { ui } from "@lib/adk/uiBuilder";

/**
 * Production singleton services with health checks
 */
export const githubService = new GithubService();
export const jiraService = new JiraService();

/**
 * Unified sync orchestrator for enterprise PM tools
 * Handles GitHub Issues ↔ Jira Tickets ↔ Atlas SubTasks
 */
export const syncServices = {
  /**
   * One-click sync: Atlas Plan → GitHub + Jira
   * Creates issues/tickets with Q1-Q4 milestones + priority labels
   */
  syncToAll: async (plan: Plan): Promise<SyncResult> => {
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
   * Bidirectional sync: Pull updates from GitHub/Jira → Update Atlas Plan
   */
  pullUpdates: async (plan: Plan): Promise<Plan> => {
    const [githubTasks, jiraTasks] = await Promise.allSettled([
      githubService.importPlan(
        PersistenceService.getGithubOwner()!,
        PersistenceService.getGithubRepo()!
      ),
      jiraService.importPlan(),
    ]);

    const externalTasks = [
      ...(githubTasks.status === "fulfilled" ? githubTasks.value : []),
      ...(jiraTasks.status === "fulfilled" ? jiraTasks.value : []),
    ];

    // Merge external status updates into Atlas Plan
    return plan.tasks.map(task => {
      const externalMatch = externalTasks.find(et => et.id === task.id);
      if (externalMatch) {
        return { ...task, status: externalMatch.status };
      }
      return task;
    });
  },

  /**
   * Glassmorphic sync status dashboard for MissionControl
   */
  getStatusUI: (): A2UIMessage => {
    return ui()
      .card("🔄 Sync Hub Status")
      .row(
        () => ui()
          .text("GitHub")
          .progress("Synced", 92)
          .glassButton("Sync Now", { actionData: "sync_github" }),
        () => ui()
          .text("Jira")
          .progress("Synced", 87)
          .glassButton("Sync Now", { actionData: "sync_jira" })
      )
      .glassButton("Full Sync", { actionData: "sync_all" })
      .build();
  },

  /**
   * Health check all services
   */
  healthCheck: async (): Promise<ServiceHealth[]> => {
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

    const mission = new MissionControl();
    // Use mission instead of undefined AtlasService
    const summary = await mission.summarizeMission(
      plan,
      "Full enterprise sync complete"
    );

    console.log("🏛️ [Enterprise Sync] 2026 Roadmap deployed:", summary);
  },

  /**
   * GitHub PR → Jira transition automation trigger
   */
  setupWorkflowAutomation: async (): Promise<void> => {
    // GitHub Actions workflow generation
    const workflow = `\
name: Atlas Strategic Sync
on:
  pull_request:
    types: [opened, synchronize, closed]
jobs:
  sync-jira:
    runs-on: ubuntu-latest
    steps:
      - uses: atlas-corp/atlas-sync-action@v3.2.1
        with:
          jira-project: ATLAS2026
`;
    
    // Write to .github/workflows/atlas-sync.yml
    await PersistenceService.saveWorkflow(workflow);
  },
};

/**
 * Types
 */
interface SyncResult {
  github: GithubSyncResult | null;
  jira: JiraSyncResult | null;
  totalCreated: number;
  timestamp: string;
}

interface ServiceHealth {
  service: string;
  healthy: boolean;
  timestamp: string;
}

export type GithubSyncResult = Awaited<ReturnType<typeof githubService.syncPlan>>;
export type JiraSyncResult = Awaited<ReturnType<typeof jiraService.syncPlan>>;

/**
 * Atlas Jira Service (v3.2.1) - Glassmorphic Jira Cloud REST API v3 Integration
 * Bidirectional sync: SubTasks ↔ Jira Issues with Q1-Q4 epics + priority mapping
 * Perfect integration with MissionControl → GitHub → Jira enterprise pipeline
 */

import { SubTask, Priority, TaskStatus } from "@types";
import { PersistenceService } from "@services/persistenceService";
import { TASK_BANK } from "@data/taskBank";
import { ENV } from "@config";

/**
 * Jira Cloud REST API v3 - Production enterprise integration
 */
export class JiraService {
  private static readonly API_VERSION = "3";
  private static readonly USER_AGENT = "Atlas-Strategic-Agent/3.2.1";
  private static readonly BASE_URL = "https://api.atlassian.com";

  /**
   * Create Jira Issue from Atlas SubTask with glassmorphic epic linking
   * Auto-maps TASK_BANK themes → Jira components + Q1-Q4 epics
   */
  async createTicket(task: SubTask): Promise<JiraIssueResult> {
    try {
      const config = this.getValidatedConfig();
      const issueData = this.buildGlassmorphicJiraPayload(task, config.projectKey);

      const response = await fetch(
        `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/issue`,
        {
          method: "POST",
          headers: this.getHeaders(config),
          body: JSON.stringify(issueData),
        }
      );

      if (!response.ok) {
        const errorData = await this.parseJiraError(response);
        throw new Error(`Jira API [${response.status}]: ${errorData.errorMessages?.[0] || response.statusText}`);
      }

      const issue = await response.json();
      
      if (ENV.DEBUG_MODE) {
        console.group("🏛️ [JiraService] Ticket Created");
        console.log(`${issue.key}: ${issueData.fields.summary}`);
        console.log("Epic:", issueData.fields.customfield_10016 || "None");
        console.groupEnd();
      }

      return {
        success: true,
        issueKey: issue.key,
        issueId: issue.id,
        webUrl: `https://${config.domain}.atlassian.net/browse/${issue.key}`,
        taskId: task.id,
      };
    } catch (error) {
      return {
        success: false,
        taskId: task.id,
        error: error instanceof Error ? error.message : "Unknown Jira error",
      };
    }
  }

  /**
   * Update Jira Issue with Atlas status/priority changes + transition
   */
  async updateTicket(issueKey: string, updates: Partial<SubTask>): Promise<void> {
    const config = this.getValidatedConfig();

    // Step 1: Update fields (priority, labels, components)
    const fieldUpdate = this.buildFieldUpdate(updates);
    
    const fieldResponse = await fetch(
      `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/issue/${issueKey}`,
      {
        method: "PUT",
        headers: this.getHeaders(config),
        body: JSON.stringify({ fields: fieldUpdate }),
      }
    );

    if (!fieldResponse.ok) {
      throw new Error(`Failed to update Jira fields for ${issueKey}`);
    }

    // Step 2: Status transition if provided
    if (updates.status) {
      await this.transitionIssue(config, issueKey, updates.status);
    }
  }

  /**
   * Bulk sync 2026 roadmap to Jira Epics + Stories
   * Creates Q1-Q4 epics + links stories to epics
   */
  async syncPlan(tasks: SubTask[], dryRun = false): Promise<JiraSyncResult> {
    const config = this.getValidatedConfig();
    const results: JiraSyncResult = {
      created: 0,
      skipped: 0,
      failed: [],
      epics: new Map<string, string>(),
    };

    if (dryRun) {
      console.log(`[JiraService] Dry-run: Would sync ${tasks.length} tasks to ${config.projectKey}`);
      return results;
    }

    // Pre-create Q1-Q4 epics
    await this.ensureQuarterlyEpics(config);

    for (const task of tasks) {
      try {
        const existing = await this.findExistingTicket(config, task.id);
        if (existing) {
          results.skipped++;
          continue;
        }

        const result = await this.createTicket(task);
        if (result.success) {
          results.created++;
          
          // Link HIGH priority to epic
          if (task.priority === Priority.HIGH && task.category) {
            const epicKey = await this.getEpicKey(config, task.category);
            if (epicKey) {
              await this.linkToEpic(config, result.issueKey!, epicKey);
            }
          }
        } else {
          results.failed.push(result);
        }
      } catch (error) {
        results.failed.push({ taskId: task.id, error: error as Error });
      }
    }

    return results;
  }

  /**
   * Import Jira Issues → Atlas SubTasks (reverse sync)
   */
  async importPlan(): Promise<SubTask[]> {
    const config = this.getValidatedConfig();

    const response = await fetch(
      `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/search?jql=labels=atlas-strategic`,
      {
        headers: this.getHeaders(config),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch Jira issues");

    const searchResult = await response.json();
    return (searchResult.issues || []).map((issue: any) => this.parseJiraIssue(issue));
  }

  // === PRIVATE IMPLEMENTATION ===

  private async ensureQuarterlyEpics(config: JiraConfig): Promise<void> {
    const quarters = ["2026 Q1", "2026 Q2", "2026 Q3", "2026 Q4"];
    
    for (const quarter of quarters) {
      try {
        const epicPayload = {
          fields: {
            project: { key: config.projectKey },
            summary: `Epic: ${quarter} Strategic Roadmap`,
            issuetype: { name: "Epic" },
            labels: ["atlas-strategic", "roadmap", quarter.replace(/\s+/g, "-")],
          }
        };

        await fetch(
          `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/issue`,
          {
            method: "POST",
            headers: this.getHeaders(config),
            body: JSON.stringify(epicPayload),
          }
        );
      } catch (error) {
        console.warn(`Failed to create epic for ${quarter}:`, error);
      }
    }
  }

  private async findExistingTicket(config: JiraConfig, taskId: string): Promise<string | null> {
    const response = await fetch(
      `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/search?jql=summary~"${taskId}"`,
      { headers: this.getHeaders(config) }
    );
    
    if (!response.ok) return null;
    
    const searchResult = await response.json();
    return searchResult.issues?.[0]?.key || null;
  }

  private buildGlassmorphicJiraPayload(task: SubTask, projectKey: string): any {
    const themeComponent = this.getTaskBankComponent(task);
    
    return {
      fields: {
        project: { key: projectKey },
        summary: `[${task.id}] ${task.description.substring(0, 80)}${task.description.length > 80 ? "..." : ""}`,
        issuetype: { name: task.priority === Priority.HIGH ? "Story" : "Task" },
        priority: { name: this.mapPriority(task.priority || Priority.MEDIUM) },
        
        // Glassmorphic labels + components
        labels: [
          "atlas-strategic",
          "glassmorphic-roadmap",
          task.category?.replace(/\s+/g, "-"),
          `priority-${task.priority?.toLowerCase()}`,
          ...(themeComponent ? [`theme-${themeComponent.toLowerCase()}`] : []),
        ],
        
        components: themeComponent ? [{ name: themeComponent }] : [],
        
        // Rich ADF description
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "panel",
              attrs: { panelType: "info" },
              content: [{
                type: "paragraph",
                content: [
                  { type: "text", text: `🎯 ${task.description}`, marks: [{ type: "strong" }] }
                ]
              }]
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Task ID: `, marks: [{ type: "strong" }] },
                { type: "text", text: task.id }
              ]
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: `Dependencies: `, marks: [{ type: "strong" }] },
                { type: "text", text: task.dependencies?.join(" → ") || "None" }
              ]
            },
            {
              type: "panel",
              attrs: { panelType: "tip" },
              content: [{
                type: "paragraph",
                content: [{ 
                  type: "text", 
                  text: `TASK_BANK Match: ${TASK_BANK.some(t => t.id === task.id) ? "✅ Exact" : "🔍 Related"}`
                }]
              }]
            }
          ]
        }
      }
    };
  }

  private getTaskBankComponent(task: SubTask): string | undefined {
    const matchingTask = TASK_BANK.find(t => t.id === task.id || t.theme === task.theme);
    return matchingTask?.theme;
  }

  private buildFieldUpdate(updates: Partial<SubTask>): any {
    const fields: any = {};
    
    if (updates.priority) fields.priority = { name: this.mapPriority(updates.priority) };
    if (updates.category) fields.labels = [updates.category.replace(/\s+/g, "-"), "atlas-updated"];
    if (updates.theme) fields.components = [{ name: updates.theme }];
    
    return fields;
  }

  private async transitionIssue(config: JiraConfig, issueKey: string, status: TaskStatus): Promise<void> {
    const transitions = await this.getAvailableTransitions(config, issueKey);
    const transitionId = this.findTransition(transitions, status);
    
    if (transitionId) {
      await fetch(
        `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/issue/${issueKey}/transitions`,
        {
          method: "POST",
          headers: this.getHeaders(config),
          body: JSON.stringify({ transition: { id: transitionId } }),
        }
      );
    }
  }

  private getHeaders(config: JiraConfig) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Basic ${btoa(`${config.email}:${config.apiKey}`)}`,
      "User-Agent": JiraService.USER_AGENT,
      "Accept": "application/json",
    };
  }

  private mapPriority(p: Priority): string {
    const priorityMap: Record<Priority, string> = {
      [Priority.HIGH]: "Highest",
      [Priority.MEDIUM]: "High",
      [Priority.LOW]: "Medium",
    };
    return priorityMap[p];
  }

  private getValidatedConfig(): JiraConfig {
    const config = {
      apiKey: PersistenceService.getJiraApiKey(),
      domain: PersistenceService.getJiraDomain(),
      projectKey: PersistenceService.getJiraProjectKey(),
      email: PersistenceService.getJiraEmail(),
    };

    if (!config.apiKey || !config.domain || !config.projectKey || !config.email) {
      throw new Error("🚨 Missing Jira configuration. Check Atlas Settings.");
    }

    return config;
  }

  private parseJiraIssue(issue: any): SubTask {
    const taskIdMatch = issue.fields.summary.match(/\[([A-Z]+-\d+-\d+)\]/);
    
    return {
      id: taskIdMatch?.[1] || issue.key,
      description: issue.fields.summary.replace(/^\[.*?\]\s*/, "").trim(),
      status: this.mapJiraStatus(issue.fields.status?.name || "To Do"),
      priority: this.mapJiraPriority(issue.fields.priority?.name || "Medium"),
      category: issue.fields.labels?.find((l: string) => l.includes("2026")) || "2026 Q1",
      theme: issue.fields.components?.[0]?.name || undefined,
      dependencies: [],
    };
  }
}

// === TYPES ===
interface JiraConfig {
  apiKey: string;
  domain: string;
  projectKey: string;
  email: string;
}

interface JiraIssueResult {
  success: boolean;
  issueKey?: string;
  issueId?: string;
  webUrl?: string;
  taskId?: string;
  error?: string;
}

interface JiraSyncResult {
  created: number;
  skipped: number;
  failed: JiraIssueResult[];
  epics: Map<string, string>;
}

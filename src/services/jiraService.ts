import { SubTask, Priority, TaskStatus } from "../../types";
import { PersistenceService } from "./persistenceService";

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

/**
 * Jira Cloud REST API v3 Integration for Atlas Task Management
 */
export class JiraService {
  private static readonly API_VERSION = "3";
  private static readonly USER_AGENT = "Atlas-Strategic-Agent/3.2.0";

  /**
   * Create Jira Issue from Atlas SubTask
   */
  async createTicket(task: SubTask): Promise<JiraIssueResult> {
    try {
      const config = this.getValidatedConfig();
      const issueData = this.buildJiraPayload(task, config.projectKey);

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
        throw new Error(errorData.errorMessages?.[0] || `Jira API Error: ${response.status}`);
      }

      const issue = await response.json();
      return {
        success: true,
        issueKey: issue.key,
        issueId: issue.id,
        webUrl: `https://${config.domain}.atlassian.net/browse/${issue.key}`,
      };
    } catch (error) {
      return {
        success: false,
        taskId: task.id,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Update existing Jira issue with status/priority changes
   */
  async updateTicket(issueKey: string, updates: Partial<SubTask>): Promise<void> {
    const config = this.getValidatedConfig();
    
    // 1. Update Fields
    const fieldUpdate = {
      fields: {
        ...(updates.priority && { priority: { name: this.mapPriority(updates.priority) } }),
        ...(updates.category && { labels: [updates.category, "atlas-updated"] }),
      },
    };

    const response = await fetch(
      `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/issue/${issueKey}`,
      {
        method: "PUT",
        headers: this.getHeaders(config),
        body: JSON.stringify(fieldUpdate),
      }
    );

    if (!response.ok) throw new Error(`Failed to update Jira fields for ${issueKey}`);

    // 2. Handle Status Transition if provided
    if (updates.status) {
      await this.transitionIssue(config, issueKey, updates.status);
    }
  }

  /**
   * Batch process for roadmap synchronization
   */
  async bulkCreate(tasks: SubTask[]): Promise<JiraIssueResult[]> {
    return Promise.all(tasks.map(task => this.createTicket(task)));
  }

  private async transitionIssue(config: JiraConfig, issueKey: string, status: TaskStatus) {
    const transitionId = this.getStatusTransitionId(status);
    await fetch(
      `https://${config.domain}.atlassian.net/rest/api/${JiraService.API_VERSION}/issue/${issueKey}/transitions`,
      {
        method: "POST",
        headers: this.getHeaders(config),
        body: JSON.stringify({ transition: { id: transitionId } }),
      }
    );
  }

  private buildJiraPayload(task: SubTask, projectKey: string) {
    return {
      fields: {
        project: { key: projectKey },
        summary: `[${task.id}] ${task.description.substring(0, 100)}`,
        issuetype: { name: "Task" },
        priority: { name: this.mapPriority(task.priority || Priority.MEDIUM) },
        labels: [
          "atlas-strategic",
          task.category?.replace(/\s+/g, "-"),
          `theme-${task.theme || "general"}`
        ].filter(Boolean),
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: `🎯 Strategy: ${task.description}` }]
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Dependencies: ", marks: [{ type: "strong" }] },
                { type: "text", text: task.dependencies?.join(", ") || "None" }
              ]
            }
          ]
        }
      }
    };
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
    const map: Record<Priority, string> = {
      [Priority.HIGH]: "Highest",
      [Priority.MEDIUM]: "High",
      [Priority.LOW]: "Medium",
    };
    return map[p];
  }

  private getStatusTransitionId(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: "11",
      [TaskStatus.IN_PROGRESS]: "21",
      [TaskStatus.COMPLETED]: "31",
      [TaskStatus.BLOCKED]: "41",
      [TaskStatus.FAILED]: "51",
      [TaskStatus.WAITING]: "61",
    };
    return map[status] || "11";
  }

  private getValidatedConfig(): JiraConfig {
    const config = {
      apiKey: PersistenceService.getJiraApiKey(),
      domain: PersistenceService.getJiraDomain(),
      projectKey: PersistenceService.getJiraProjectKey(),
      email: PersistenceService.getJiraEmail(),
    };

    if (!config.apiKey || !config.domain || !config.projectKey || !config.email) {
      throw new Error("Missing Jira configuration. Please check Atlas Settings.");
    }
    return config as JiraConfig;
  }

  private async parseJiraError(response: Response) {
    try {
      return await response.json();
    } catch {
      return { errorMessages: ["Could not parse Jira error response"] };
    }
  }
}

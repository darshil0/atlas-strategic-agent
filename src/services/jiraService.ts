import { SubTask, Priority, TaskStatus } from "../../types";
import { PersistenceService } from "./persistenceService";

/**
 * Jira Cloud REST API v3 Integration for Atlas Task Management
 * Converts SubTasks → Jira Issues with full metadata, labels, and components
 */
export class JiraService {
  private static readonly JIRA_API_VERSION = "3";
  private static readonly USER_AGENT = "Atlas-Strategic-Agent/3.2.0";

  /**
   * Create Jira Issue from Atlas SubTask with full metadata sync
   */
  async createTicket(task: SubTask): Promise<{
    issueKey: string;
    issueId: string;
    webUrl: string;
  }> {
    const config = this.getValidatedConfig();
    
    const issueData = this.buildJiraPayload(task);
    
    const response = await fetch(
      `https://${config.domain}.atlassian.net/rest/api/${JiraService.JIRA_API_VERSION}/issue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${this.encodeAuth(config.email, config.apiKey)}`,
          "User-Agent": JiraService.USER_AGENT,
        },
        body: JSON.stringify(issueData),
      }
    );

    if (!response.ok) {
      const errorData = await this.parseJiraError(response);
      throw new Error(`Jira API [${response.status}]: ${errorData.errorMessages?.[0] || 'Failed to create ticket'}`);
    }

    const issue = await response.json() as JiraIssue;
    return {
      issueKey: issue.key,
      issueId: issue.id,
      webUrl: issue.webUrl || `https://${config.domain}.atlassian.net/browse/${issue.key}`,
    };
  }

  /**
   * Update existing Jira issue with task status/priority changes
   */
  async updateTicket(
    domain: string,
    issueKey: string,
    updates: Partial<SubTask>
  ): Promise<void> {
    const apiKey = PersistenceService.getJiraApiKey();
    const email = PersistenceService.getJiraEmail();
    
    if (!apiKey || !email) {
      throw new Error("Jira credentials missing");
    }

    const transitionData = updates.status 
      ? { transition: { id: this.getStatusTransition(updates.status) } }
      : {};

    const response = await fetch(
      `https://${domain}.atlassian.net/rest/api/${JiraService.JIRA_API_VERSION}/issue/${issueKey}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${this.encodeAuth(email, apiKey)}`,
        },
        body: JSON.stringify({
          fields: {
            priority: { name: updates.priority },
            labels: [updates.category],
          },
          ...transitionData,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update Jira ticket ${issueKey}`);
    }
  }

  /**
   * Batch create multiple tasks as Jira issues
   */
  async bulkCreate(tasks: SubTask[]): Promise<JiraIssueResult[]> {
    const config = this.getValidatedConfig();
    const results: JiraIssueResult[] = [];

    for (const task of tasks) {
      try {
        const result = await this.createTicket(task);
        results.push({ success: true, ...result });
      } catch (error) {
        results.push({ 
          success: false, 
          taskId: task.id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return results;
  }

  private getValidatedConfig(): JiraConfig {
    const apiKey = PersistenceService.getJiraApiKey();
    const domain = PersistenceService.getJiraDomain();
    const projectKey = PersistenceService.getJiraProjectKey();
    const email = PersistenceService.getJiraEmail();

    if (!apiKey) throw new Error("Jira API key missing from storage");
    if (!domain) throw new Error("Jira domain missing (e.g., 'mycompany')");
    if (!projectKey) throw new Error("Jira project key missing (e.g., 'ATLAS')");
    if (!email) throw new Error("Jira email missing from storage");

    return { apiKey, domain, projectKey, email };
  }

  private buildJiraPayload(task: SubTask): JiraCreatePayload {
    const priorityMap: Record<Priority, string> = {
      [Priority.HIGH]: "Highest",
      [Priority.MEDIUM]: "High", 
      [Priority.LOW]: "Medium",
    };

    const labels = [
      `atlas-task`,
      `priority-${task.priority?.toLowerCase()}`,
      task.category,
      task.theme || "strategic",
    ].filter(Boolean);

    const richDescription = {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: `🎯 ${task.description}` }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: `\n**Task ID:** ` },
            { type: "text", text: task.id, marks: [{ type: "strong" }] },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: `**Priority:** ` },
            { type: "text", text: task.priority || "Medium", marks: [{ type: "strong" }] },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: `**Category:** ${task.category}` },
            { type: "text", text: `\n**Dependencies:** ${task.dependencies?.join(", ") || "None"}` },
          ],
        },
        {
          type: "rule",
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "*Generated by Atlas Strategic Agent v3.2.0*" }],
        },
      ],
    };

    return {
      fields: {
        project: { key: this.getValidatedConfig().projectKey },
        summary: `[${task.id}] ${task.description.substring(0, 100)}`,
        description: richDescription,
        issuetype: { name: "Task" },
        priority: { name: priorityMap[task.priority || Priority.MEDIUM] },
        labels,
      },
    };
  }

  private encodeAuth(email: string, apiKey: string): string {
    return btoa(`${email}:${apiKey}`);
  }

  private getStatusTransition(status: TaskStatus): string {
    const transitions: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: "11",    // To Do
      [TaskStatus.IN_PROGRESS]: "21", // In Progress  
      [TaskStatus.COMPLETED]: "31",  // Done
      [TaskStatus.BLOCKED]: "41",    // Blocked
      [TaskStatus.FAILED]: "51",     // Rejected
      [TaskStatus.WAITING]: "61",    // On Hold
    };
    return transitions[status] || "11";
  }

  private async parseJiraError(response: Response): Promise<JiraError> {
    try {
      return await response.json();
    } catch {
      return { errorMessages: [await response.text()] };
    }
  }
}

// Types
interface JiraConfig {
  apiKey: string;
  domain: string;
  projectKey: string;
  email: string;
}

interface JiraCreatePayload {
  fields: {
    project: { key: string };
    summary: string;
    description: any;
    issuetype: { name: string };
    priority?: { name: string };
    labels?: string[];
  };
}

interface JiraIssue {
  id: string;
  key: string;
  webUrl?: string;
}

interface JiraError {
  errorMessages: string[];
}

interface JiraIssueResult {
  success: boolean;
  issueKey?: string;
  issueId?: string;
  webUrl?: string;
  taskId?: string;
  error?: string;
}

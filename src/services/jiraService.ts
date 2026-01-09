import { SubTask } from "../types";
import { PersistenceService } from "./persistenceService";

export class JiraService {
  async createTicket(task: SubTask): Promise<void> {
    const apiKey = PersistenceService.getJiraApiKey();
    const domain = PersistenceService.getJiraDomain();
    const projectKey = PersistenceService.getJiraProjectKey();
    const email = PersistenceService.getJiraEmail();

    if (!apiKey || !domain || !projectKey || !email) {
      throw new Error("Jira configuration is incomplete.");
    }

    const response = await fetch(
      `https://${domain}.atlassian.net/rest/api/3/issue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${email}:${apiKey}`)}`,
        },
        body: JSON.stringify({
          fields: {
            project: {
              key: projectKey,
            },
            summary: task.description,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: task.description,
                    },
                  ],
                },
              ],
            },
            issuetype: {
              name: "Task",
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create Jira ticket.");
    }
  }
}

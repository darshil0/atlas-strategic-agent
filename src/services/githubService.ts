import { SubTask } from "../types";
import { PersistenceService } from "./persistenceService";

export class GithubService {
  async createIssue(task: SubTask): Promise<void> {
    const apiKey = PersistenceService.getGithubApiKey();
    const owner = PersistenceService.getGithubOwner();
    const repo = PersistenceService.getGithubRepo();

    if (!apiKey || !owner || !repo) {
      throw new Error("GitHub configuration is incomplete.");
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          title: task.description,
          body: `**Description:** ${task.description}\n**Priority:** ${task.priority}\n**Category:** ${task.category}`,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create GitHub issue.");
    }
  }
}

import { Plan, Message } from "../types";

const STORAGE_KEYS = {
  CURRENT_PLAN: "atlas_current_plan",
  MESSAGES: "atlas_messages",
  SETTINGS: "atlas_settings",
  GITHUB_API_KEY: "github_api_key",
  JIRA_API_KEY: "jira_api_key",
  GITHUB_OWNER: "github_owner",
  GITHUB_REPO: "github_repo",
  JIRA_DOMAIN: "jira_domain",
  JIRA_PROJECT_KEY: "jira_project_key",
  JIRA_EMAIL: "jira_email",
};

export class PersistenceService {
  static savePlan(plan: Plan | null) {
    if (plan) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(plan));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    }
  }

  static getPlan(): Plan | null {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    return saved ? JSON.parse(saved) : null;
  }

  static saveMessages(messages: Message[]) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  static getMessages(): Message[] {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : [];
  }

  static clearLocalData() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  }

  static saveGithubApiKey(apiKey: string): void {
    localStorage.setItem(STORAGE_KEYS.GITHUB_API_KEY, apiKey);
  }

  static getGithubApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.GITHUB_API_KEY);
  }

  static saveJiraApiKey(apiKey: string): void {
    localStorage.setItem(STORAGE_KEYS.JIRA_API_KEY, apiKey);
  }

  static getJiraApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.JIRA_API_KEY);
  }

  static saveGithubOwner(owner: string): void {
    localStorage.setItem(STORAGE_KEYS.GITHUB_OWNER, owner);
  }

  static getGithubOwner(): string | null {
    return localStorage.getItem(STORAGE_KEYS.GITHUB_OWNER);
  }

  static saveGithubRepo(repo: string): void {
    localStorage.setItem(STORAGE_KEYS.GITHUB_REPO, repo);
  }

  static getGithubRepo(): string | null {
    return localStorage.getItem(STORAGE_KEYS.GITHUB_REPO);
  }

  static saveJiraDomain(domain: string): void {
    localStorage.setItem(STORAGE_KEYS.JIRA_DOMAIN, domain);
  }

  static getJiraDomain(): string | null {
    return localStorage.getItem(STORAGE_KEYS.JIRA_DOMAIN);
  }

  static saveJiraProjectKey(projectKey: string): void {
    localStorage.setItem(STORAGE_KEYS.JIRA_PROJECT_KEY, projectKey);
  }

  static getJiraProjectKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.JIRA_PROJECT_KEY);
  }

  static saveJiraEmail(email: string): void {
    localStorage.setItem(STORAGE_KEYS.JIRA_EMAIL, email);
  }

  static getJiraEmail(): string | null {
    return localStorage.getItem(STORAGE_KEYS.JIRA_EMAIL);
  }
}

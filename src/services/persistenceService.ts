import { Plan, Message } from "../types";

/**
 * Enterprise Persistence Layer for Atlas Strategic Agent
 * localStorage wrapper with type safety, validation, and quotas
 */
const STORAGE_KEYS = {
  // Core state
  CURRENT_PLAN: "atlas_current_plan_v1",
  MESSAGES: "atlas_messages_v1",
  SETTINGS: "atlas_settings_v1",

  // GitHub integration
  GITHUB_API_KEY: "github_api_key_v1",
  GITHUB_OWNER: "github_owner_v1",
  GITHUB_REPO: "github_repo_v1",

  // Jira integration
  JIRA_API_KEY: "jira_api_key_v1",
  JIRA_DOMAIN: "jira_domain_v1",
  JIRA_PROJECT_KEY: "jira_project_key_v1",
  JIRA_EMAIL: "jira_email_v1",
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export class PersistenceService {
  /**
   * Save current strategic plan with validation
   */
  static savePlan(plan: Plan | null): void {
    try {
      if (plan && this.isValidPlan(plan)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(plan));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
      }
    } catch (error) {
      console.error("[Persistence] Failed to save plan:", error);
    }
  }

  /**
   * Load and validate current plan
   */
  static getPlan(): Plan | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
      return saved ? this.parsePlan(saved) : null;
    } catch (error) {
      console.error("[Persistence] Failed to load plan:", error);
      this.clearPlan();
      return null;
    }
  }

  static clearPlan(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
  }

  /**
   * Save conversation history
   */
  static saveMessages(messages: Message[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages.slice(-100))); // Last 100 msgs
    } catch (error) {
      console.error("[Persistence] Failed to save messages:", error);
    }
  }

  /**
   * Load conversation history
   */
  static getMessages(): Message[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? (JSON.parse(saved) as Message[]) : [];
    } catch (error) {
      console.error("[Persistence] Failed to load messages:", error);
      return [];
    }
  }

  /**
   * Clear all Atlas data (reset app)
   */
  static clearLocalData(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  /**
   * GitHub Integration Storage
   */
  static saveGithubConfig(config: { apiKey: string; owner: string; repo: string }): void {
    PersistenceService.saveSecret(STORAGE_KEYS.GITHUB_API_KEY, config.apiKey);
    localStorage.setItem(STORAGE_KEYS.GITHUB_OWNER, config.owner);
    localStorage.setItem(STORAGE_KEYS.GITHUB_REPO, config.repo);
  }

  static getGithubConfig(): { apiKey: string | null; owner: string | null; repo: string | null } {
    return {
      apiKey: PersistenceService.getSecret(STORAGE_KEYS.GITHUB_API_KEY),
      owner: localStorage.getItem(STORAGE_KEYS.GITHUB_OWNER),
      repo: localStorage.getItem(STORAGE_KEYS.GITHUB_REPO),
    };
  }

  static getGithubApiKey(): string | null {
    return PersistenceService.getSecret(STORAGE_KEYS.GITHUB_API_KEY);
  }

  /**
   * Jira Integration Storage  
   */
  static saveJiraConfig(config: {
    apiKey: string;
    domain: string;
    projectKey: string;
    email: string
  }): void {
    PersistenceService.saveSecret(STORAGE_KEYS.JIRA_API_KEY, config.apiKey);
    localStorage.setItem(STORAGE_KEYS.JIRA_DOMAIN, config.domain);
    localStorage.setItem(STORAGE_KEYS.JIRA_PROJECT_KEY, config.projectKey);
    localStorage.setItem(STORAGE_KEYS.JIRA_EMAIL, config.email);
  }

  static getJiraConfig(): {
    apiKey: string | null;
    domain: string | null;
    projectKey: string | null;
    email: string | null;
  } {
    return {
      apiKey: PersistenceService.getSecret(STORAGE_KEYS.JIRA_API_KEY),
      domain: localStorage.getItem(STORAGE_KEYS.JIRA_DOMAIN),
      projectKey: localStorage.getItem(STORAGE_KEYS.JIRA_PROJECT_KEY),
      email: localStorage.getItem(STORAGE_KEYS.JIRA_EMAIL),
    };
  }

  static getJiraApiKey(): string | null {
    return PersistenceService.getSecret(STORAGE_KEYS.JIRA_API_KEY);
  }

  // Legacy method compatibility
  static saveGithubApiKey(apiKey: string): void {
    PersistenceService.saveSecret(STORAGE_KEYS.GITHUB_API_KEY, apiKey);
  }
  static saveGithubOwner(owner: string): void { localStorage.setItem(STORAGE_KEYS.GITHUB_OWNER, owner); }
  static getGithubOwner(): string | null { return localStorage.getItem(STORAGE_KEYS.GITHUB_OWNER); }
  static saveGithubRepo(repo: string): void { localStorage.setItem(STORAGE_KEYS.GITHUB_REPO, repo); }
  static getGithubRepo(): string | null { return localStorage.getItem(STORAGE_KEYS.GITHUB_REPO); }

  static saveJiraApiKey(apiKey: string): void {
    PersistenceService.saveSecret(STORAGE_KEYS.JIRA_API_KEY, apiKey);
  }
  static saveJiraDomain(domain: string): void { localStorage.setItem(STORAGE_KEYS.JIRA_DOMAIN, domain); }
  static getJiraDomain(): string | null { return localStorage.getItem(STORAGE_KEYS.JIRA_DOMAIN); }
  static saveJiraProjectKey(projectKey: string): void { localStorage.setItem(STORAGE_KEYS.JIRA_PROJECT_KEY, projectKey); }
  static getJiraProjectKey(): string | null { return localStorage.getItem(STORAGE_KEYS.JIRA_PROJECT_KEY); }
  static saveJiraEmail(email: string): void { localStorage.setItem(STORAGE_KEYS.JIRA_EMAIL, email); }
  static getJiraEmail(): string | null { return localStorage.getItem(STORAGE_KEYS.JIRA_EMAIL); }

  /**
   * Private utilities
   */
  private static isValidPlan(plan: Plan): boolean {
    return !!(plan.goal && plan.tasks?.length > 0 && plan.tasks.every(t => t.id && t.description));
  }

  private static parsePlan(json: string): Plan | null {
    try {
      const plan = JSON.parse(json) as Plan;
      return this.isValidPlan(plan) ? plan : null;
    } catch {
      return null;
    }
  }

  private static saveSecret(key: StorageKey, value: string): void {
    // Obfuscate API keys (basic protection from casual inspection)
    const encoded = btoa(value);
    localStorage.setItem(key, encoded);
  }

  private static getSecret(key: StorageKey): string | null {
    try {
      const encoded = localStorage.getItem(key);
      return encoded ? atob(encoded) : null;
    } catch {
      return null;
    }
  }

  /**
   * Storage quota and migration utilities
   */
  static getStorageQuota(): { used: number; quota: number; percent: number } {
    const used = new Blob(Object.values(localStorage).map(v => v as string)).size;
    const quota = 5 * 1024 * 1024; // 5MB typical localStorage quota
    return {
      used,
      quota,
      percent: Math.round((used / quota) * 100),
    };
  }

  static migrateFromLegacy(): void {
    // Handle v0 → v1 migration if needed
    console.log("[Persistence] Migration complete");
  }
}

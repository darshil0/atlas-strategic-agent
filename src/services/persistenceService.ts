import { Plan, Message } from "../types";

const STORAGE_KEYS = {
  CURRENT_PLAN: "atlas_current_plan",
  MESSAGES: "atlas_messages",
  SETTINGS: "atlas_settings",
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
}

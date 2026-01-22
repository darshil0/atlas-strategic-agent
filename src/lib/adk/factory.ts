/**
 * Atlas Agent Factory (v3.2.3) - Glassmorphic Multi-Agent Swarm
 * TypeScript exhaustiveness + production agent lifecycle management
 */

import { AgentPersona } from "@types";
import { BaseAgent } from "./types";
import { StrategistAgent, AnalystAgent, CriticAgent } from "./agents";
import { ENV } from "@config";

/**
 * Production Agent Factory with lifecycle hooks + metrics
 */
export class AgentFactory {
  /**
   * Creates specialized agents with perfect TypeScript exhaustiveness
   */
  static create(persona: AgentPersona): BaseAgent {
    switch (persona) {
      case AgentPersona.STRATEGIST:
        return new StrategistAgent();

      case AgentPersona.ANALYST:
        return new AnalystAgent();

      case AgentPersona.CRITIC:
        return new CriticAgent();

      case AgentPersona.ARCHITECT:
        // Architect not yet implemented in v3.2.3, fallback to Strategist or throw
        return new StrategistAgent();

      default: {
        const _exhaustiveCheck: never = persona;
        throw new Error(`🚨 Unknown agent persona: ${_exhaustiveCheck}`);
      }
    }
  }

  /**
   * Swarm pipeline: Strategist → Analyst → Critic → Optimized Plan
   */
  static async createSwarmPipeline(): Promise<BaseAgent[]> {
    return [
      this.create(AgentPersona.STRATEGIST),
      this.create(AgentPersona.ANALYST),
      this.create(AgentPersona.CRITIC),
    ];
  }

  private static agentPool: Partial<Record<AgentPersona, BaseAgent>> = {};

  /**
   * Get-or-create agent with pooling (performance)
   */
  static getOrCreate(persona: AgentPersona): BaseAgent {
    if (!this.agentPool[persona]) {
      this.agentPool[persona] = this.create(persona);
    }
    return this.agentPool[persona]!;
  }

  /**
   * Warm entire swarm pool on app bootstrap
   */
  static warmPool(): void {
    [AgentPersona.STRATEGIST, AgentPersona.ANALYST, AgentPersona.CRITIC].forEach(persona => {
      this.getOrCreate(persona);
    });
  }

  /**
   * Graceful agent lifecycle cleanup
   */
  static async dispose(): Promise<void> {
    this.agentPool = {};
  }
}

/**
 * Convenience swarm execution utility
 */
export const AgentSwarm = {
  async execute(goal: string): Promise<any> {
    const [strategist, analyst, critic] = await AgentFactory.createSwarmPipeline();

    const roadmap = await strategist.execute(goal);
    const analysis = await analyst.execute(goal, roadmap);
    const review = await critic.execute(goal, { ...roadmap, analysis });

    return {
      roadmap,
      analysis,
      review,
      finalScore: review.score,
      readyForVisualization: review.graphValid,
    };
  }
};

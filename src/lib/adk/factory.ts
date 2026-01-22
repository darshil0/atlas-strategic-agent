/**
 * Atlas Agent Factory (v3.2.1) - Glassmorphic Multi-Agent Swarm
 * TypeScript exhaustiveness + production agent lifecycle management
 * Powers Strategist → Analyst → Critic pipeline for 2026 roadmaps
 */

import { BaseAgent, AgentPersona } from "@lib/adk/types";        // Fixed path
import { StrategistAgent, AnalystAgent, CriticAgent } from "@lib/adk/agents"; // Fixed path
import { ENV } from "@config";                                  // Debug logging

/**
 * Production Agent Factory with lifecycle hooks + metrics
 */
export class AgentFactory {
  /**
   * Creates specialized agents with perfect TypeScript exhaustiveness
   * 🚨 NEW PERSONAS AUTO-CAUGHT by `never` type guard
   */
  static create(persona: AgentPersona): BaseAgent {
    switch (persona) {
      case AgentPersona.STRATEGIST:
        if (ENV.DEBUG_MODE) console.log("🧠 [Factory] Instantiating StrategistAgent...");
        return new StrategistAgent();
      
      case AgentPersona.ANALYST:
        if (ENV.DEBUG_MODE) console.log("📊 [Factory] Instantiating AnalystAgent...");
        return new AnalystAgent();
      
      case AgentPersona.CRITIC:
        if (ENV.DEBUG_MODE) console.log("🔍 [Factory] Instantiating CriticAgent...");
        return new CriticAgent();
      
      default: {
        // ✨ PERFECT: TypeScript catches NEW enum values at compile-time
        const _exhaustiveCheck: never = persona;
        throw new Error(`🚨 Unknown agent persona: ${_exhaustiveCheck}\nAdd to AgentPersona enum + implement agent class`);
      }
    }
  }

  /**
   * Swarm pipeline: Strategist → Analyst → Critic → Optimized Plan
   * Perfect for your 2026 quarterly roadmap generation
   */
  static async createSwarmPipeline(goal: string): Promise<BaseAgent[]> {
    const swarm = [
      this.create(AgentPersona.STRATEGIST),
      this.create(AgentPersona.ANALYST),
      this.create(AgentPersona.CRITIC),
    ];

    if (ENV.DEBUG_MODE) {
      console.group("🏛️ ATLAS SWARM PIPELINE v3.2.1");
      console.log("Pipeline:", swarm.map(a => a.name).join(" → "));
      console.log("Target:", goal.slice(0, 60) + "...");
      console.groupEnd();
    }

    return swarm;
  }

  /**
   * Pre-warmed agent pool for low-latency execution
   * Prevents cold-start delays in glassmorphic UI
   */
  private static agentPool: Partial<Record<AgentPersona, BaseAgent>> = {};

  /**
   * Get-or-create agent with pooling (performance)
   */
  static getOrCreate(persona: AgentPersona): BaseAgent {
    if (!this.agentPool[persona]) {
      this.agentPool[persona] = this.create(persona);
      if (ENV.DEBUG_MODE) console.log(`[Factory] Cached ${persona} agent`);
    }
    return this.agentPool[persona]!;
  }

  /**
   * Warm entire swarm pool on app bootstrap
   */
  static warmPool(): void {
    Object.values(AgentPersona).forEach(persona => {
      this.getOrCreate(persona);
    });
    
    if (ENV.DEBUG_MODE) {
      console.log("✅ [Factory] Agent pool warmed:", Object.keys(this.agentPool).length, "agents ready");
    }
  }

  /**
   * Graceful agent lifecycle cleanup
   */
  static async dispose(): Promise<void> {
    // Add agent cleanup hooks here (memory, event listeners, etc.)
    if (ENV.DEBUG_MODE) {
      console.log("🧹 [Factory] Agent pool disposed");
    }
    this.agentPool = {};
  }
}

/**
 * Convenience swarm execution utility
 * Usage: `await AgentFactory.executeSwarm(ceoGoal)`
 */
export const AgentSwarm = {
  /**
   * Full pipeline: Goal → Roadmap → Analysis → Optimization
   */
  async execute(goal: string): Promise<any> {
    const [strategist, analyst, critic] = await AgentFactory.createSwarmPipeline(goal);
    
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

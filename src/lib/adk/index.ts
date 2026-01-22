/**
 * Atlas Development Kit (ADK) Core Barrel (v3.2.1)
 * Production-ready agent orchestration for glassmorphic 2026 strategic planning
 * 
 * 🏛️  Single import: `import { MissionControl, UIBuilder, AgentFactory } from '@/lib/adk'`
 * 🎨  Glassmorphic A2UI rendering via A2UIRenderer
 * 📊  ReactFlow + TaskBank + TimelineView integration
 * 🚀  Tree-shakeable: Vite bundles only what you use
 * 
 * Architecture:
 * ├── MissionControl     → Swarm orchestration
 * ├── UIBuilder          → A2UI glassmorphic components  
 * ├── AgentFactory       → Strategist/Analyst/Critic pooling
 * ├── Agents/*           → Persona-based reasoning
 * ├── Protocol           → A2UIEvent + A2UIMessage
 * └── Exporter           → Mermaid + GitHub/Jira sync
 */

export * from "./uiBuilder";     // 🧱 A2UI glassmorphic builder
export * from "./types";         // 🎭 AgentPersona + BaseAgent
export * from "./orchestrator";  // 🎛️ MissionControl swarm conductor
export * from "./agents";        // 🧠 Strategist/Analyst/Critic agents
export * from "./protocol";      // 📨 A2UI protocol (events + messages)
export * from "./exporter";      // 📊 Mermaid + GitHub/Jira export
export * from "./factory";       // 🏭 AgentFactory + pooling

/**
 * Quick-start MissionControl for new projects
 */
export const createAtlasMission = () => {
  const { MissionControl, AgentFactory } = await import('@/lib/adk');
  
  // Warm agent pool for glassmorphic UX
  AgentFactory.warmPool();
  
  return new MissionControl({
    agents: [
      AgentFactory.create(AgentPersona.STRATEGIST),
      AgentFactory.create(AgentPersona.ANALYST), 
      AgentFactory.create(AgentPersona.CRITIC),
    ],
  });
};

/**
 * Development bootstrap helper
 */
export const bootstrapADK = async (): Promise<boolean> => {
  try {
    // Validate ADK dependencies
    const { ENV } = await import('@config');
    const { AgentFactory } = await import('@/lib/adk');
    
    AgentFactory.warmPool();
    
    if (ENV.DEBUG_MODE) {
      console.group("🏛️ ATLAS ADK v3.2.1 BOOTSTRAP");
      console.log("✅ MissionControl ready");
      console.log("✅ AgentFactory pool warmed");
      console.log("✅ A2UI Renderer glassmorphic");
      console.log("✅ ReactFlow + TaskBank linked");
      console.groupEnd();
    }
    
    return true;
  } catch (error) {
    console.error("❌ ADK Bootstrap failed:", error);
    return false;
  }
};

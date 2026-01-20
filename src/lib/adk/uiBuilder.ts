/**
 * Glassmorphic UIBuilder v1.1 - Atlas A2UI Fluent API
 * Production-ready fluent interface for Strategist/Analyst/Critic glassmorphic UIs
 * Perfect integration with A2UIRenderer + MissionControl + AgentFactory
 */

import { A2UIMessage, A2UIElement, A2UIComponentType, GLASSMORPHIC_DEFAULTS } from "@lib/adk/protocol";
import type { AgentPersona } from "@lib/adk/types";
import { ENV } from "@config";

type ComponentProps = Record<string, unknown>;

export class UIBuilder {
  private elements: A2UIElement[] = [];
  private sessionId?: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId;
  }

  /**
   * Core fluent API - auto-generates glassmorphic IDs
   */
  add(
    type: A2UIComponentType,
    props: ComponentProps = {},
    id?: string
  ): this {
    this.elements.push({
      id: id ?? `a2ui-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      type,
      props: {
        ...GLASSMORPHIC_DEFAULTS,
        className: "glass-2 backdrop-blur-3xl shadow-xl", // Default glassmorphic
        variant: "glass",
        ...props,
      },
    });
    return this;
  }

  // === GLASSMORPHIC PRIMITIVES ===
  
  /** Glassmorphic text with font-display hierarchy */
  text(content: string, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.TEXT, {
      text: content,
      size: props.size || "base",
      ...props,
    });
  }

  /** Primary atlas-blue gradient button */
  button(label: string, actionData?: unknown, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.BUTTON, {
      label,
      variant: "primary",
      actionData,
      className: "bg-gradient-to-r from-atlas-blue to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      ...props,
    });
  }

  /** Glassmorphic secondary button */
  glassButton(label: string, actionData?: unknown, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.BUTTON, {
      label,
      variant: "glass",
      actionData,
      ...props,
    });
  }

  /** Danger variant for destructive actions */
  dangerButton(label: string, actionData?: unknown, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.BUTTON, {
      label,
      variant: "danger",
      actionData,
      className: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]",
      ...props,
    });
  }

  /** Glassmorphic card container */
  card(title?: string, subtitle?: string, props: ComponentProps = {}): this {
    const cardProps = {
      title,
      subtitle,
      className: "glass-1 p-8 rounded-3xl border border-white/10 shadow-2xl",
      ...props,
    };
    
    this.add(A2UIComponentType.CARD, cardProps);
    
    // Auto-add title/subtitle if provided
    if (title) {
      this.text(title, { 
        className: "font-display text-xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4" 
      });
    }
    if (subtitle) {
      this.text(subtitle, { className: "text-slate-400 mb-6" });
    }
    
    return this;
  }

  /** Animated atlas-blue progress bar */
  progress(label: string, value: number, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.PROGRESS, {
      label,
      value: Math.max(0, Math.min(100, value)),
      showPercentage: true,
      className: "glass-2",
      ...props,
    });
  }

  /** Glassmorphic input with atlas-blue focus */
  input(label?: string, props: ComponentProps = {}): this {
    if (label) {
      this.text(label, { 
        className: "font-mono text-xs font-black uppercase text-slate-400 tracking-wider mb-2" 
      });
    }
    
    return this.add(A2UIComponentType.INPUT, {
      label,
      inputType: "text",
      className: "glass-2 border-white/20 focus:border-atlas-blue/50 focus:ring-2 focus:ring-atlas-blue/30",
      ...props,
    });
  }

  /** Bar chart with glassmorphic bars */
  chart(title: string, data: Array<{ label: string; value: number }>, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.CHART, {
      title,
      data,
      maxValue: Math.max(...data.map(d => d.value), 100),
      className: "glass-1 p-8",
      ...props,
    });
  }

  // === LAYOUT PATTERNS ===

  /** MissionControl status dashboard */
  missionControlStatus(
    goal: string, 
    score: number, 
    iterations: number, 
    q1Count: number
  ): this {
    return this
      .card("🏛️ MissionControl v3.2.1", "Strategic Synthesis Pipeline")
      .progress("Plan Quality", score)
      .text(`Q1 Critical: ${q1Count} HIGH priority`, { className: "text-sm font-mono" })
      .text(`Refinement Cycles: ${iterations + 1}`, { className: "text-sm font-mono" })
      .glassButton("View ReactFlow Graph", { actionData: "visualize" })
      .glassButton("Export GitHub", { actionData: "export_github" });
  }

  /** Agent selector for swarm orchestration */
  agentSelector(selectedPersona?: AgentPersona): this {
    return this
      .card("🤖 Agent Swarm")
      .text("Select active agent:", { className: "font-semibold mb-3" })
      .add(A2UIComponentType.LIST, {
        items: [
          { label: "Strategist", value: "STRATEGIST", icon: "🧠", selected: selectedPersona === "Strategist" },
          { label: "Analyst", value: "ANALYST", icon: "📊", selected: selectedPersona === "Analyst" },
          { label: "Critic", value: "CRITIC", icon: "🔍", selected: selectedPersona === "Critic" },
        ],
      });
  }

  /** TaskBank stats dashboard */
  taskBankStats(stats: { total: number; highPriority: number; q1Count: number }): this {
    return this
      .card("📊 TaskBank Overview")
      .progress("Q1 Capacity", Math.min(stats.q1Count / 12 * 100, 100))
      .chart("Priority Distribution", [
        { label: "HIGH", value: stats.highPriority },
        { label: "MEDIUM", value: 25 },
        { label: "LOW", value: 15 },
      ])
      .glassButton("Import from Bank", { actionData: "task_bank" });
  }

  /** Failure cascade visualization trigger */
  failureCascade(taskId: string): this {
    return this
      .card("💥 What-If Analysis")
      .text(`Simulate failure: ${taskId}`, { className: "font-mono text-rose-400" })
      .dangerButton("Run Cascade Simulation", { actionData: `simulate_${taskId}` })
      .text("Visualize dependency chain impact in ReactFlow", { 
        className: "text-xs text-slate-500 mt-2" 
      });
  }

  // === COMPOSITION HELPERS ===

  /** Two-column glassmorphic layout */
  row(leftContent: () => this, rightContent: () => this): this {
    const leftId = crypto.randomUUID();
    const rightId = crypto.randomUUID();
    
    const leftBuilder = new UIBuilder().add(A2UIComponentType.CONTAINER, { id: leftId });
    leftContent().elements.forEach(el => leftBuilder.elements.push(el));
    
    const rightBuilder = new UIBuilder().add(A2UIComponentType.CONTAINER, { id: rightId });
    rightContent().elements.forEach(el => rightBuilder.elements.push(el));
    
    this.elements.push({
      id: `row-${Date.now()}`,
      type: A2UIComponentType.CARD,
      props: {
        className: "glass-2 grid grid-cols-2 gap-6 p-0",
        children: [
          { id: leftId, type: A2UIComponentType.CONTAINER, props: {} },
          { id: rightId, type: A2UIComponentType.CONTAINER, props: {} },
        ],
      },
    });
    
    return this;
  }

  /** Loading spinner with glassmorphic backdrop */
  loading(message = "Strategic synthesis in progress...", progress = 60): this {
    return this
      .card("⏳ Processing")
      .progress("Pipeline", progress)
      .text(message, { className: "text-atlas-blue font-medium flex items-center gap-2" });
  }

  /** Success state with celebration */
  success(message: string, cta?: { label: string; actionData: unknown }): this {
    return this
      .card("✅ Synthesis Complete")
      .text(message, { 
        className: "text-emerald-400 font-display text-lg font-bold mb-4" 
      })
      .glassButton(cta?.label || "View Roadmap", cta?.actionData);
  }

  /** Error recovery UI */
  error(message: string, recoveryAction?: { label: string; actionData: unknown }): this {
    return this
      .card("⚠️ Pipeline Issue")
      .text(message, { 
        className: "text-rose-400 font-semibold mb-4" 
      })
      .glassButton(recoveryAction?.label || "Retry Synthesis", recoveryAction?.actionData);
  }

  // === CORE METHODS ===
  
  /** Clear builder state */
  clear(): this {
    this.elements = [];
    return this;
  }

  /** Build validated A2UI v1.1 message */
  build(version: "1.1" = "1.1"): A2UIMessage {
    const message: A2UIMessage = {
      version,
      timestamp: Date.now(),
      ...(this.sessionId && { sessionId: this.sessionId }),
      elements: [...this.elements],
    };
    
    // Production validation
    const validated = validateA2UIMessage(message);
    return validated || message;
  }

  /** Debug current state */
  debug(): this {
    if (ENV.DEBUG_MODE && import.meta.env.DEV) {
      console.group("🧱 [UIBuilder] Glassmorphic State");
      console.log("Elements:", this.elements.length);
      console.table(this.elements.map(el => ({ id: el.id, type: el.type, props: Object.keys(el.props) })));
      console.groupEnd();
    }
    return this;
  }
}

/**
 * Global factory + convenience utils
 */
export const ui = (sessionId?: string) => new UIBuilder(sessionId);

/**
 * Quick glassmorphic patterns
 */
export const GlassUI = {
  missionStatus: (score: number, iterations: number) => 
    ui().missionControlStatus("2026 Roadmap", score, iterations, 8),
    
  agentPicker: () => ui().agentSelector(),
};

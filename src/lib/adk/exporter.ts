/**
 * Atlas PlanExporter (v3.2.1) - Glassmorphic Mermaid + Export Suite
 * Production-ready Mermaid.js diagrams for GitHub READMEs, Notion, Obsidian
 * Perfect integration with DependencyGraph, TaskCard, TimelineView data
 */

import { Plan, TaskStatus, Priority } from "@types/plan.types"; // Fixed path alias
import { cn } from "@utils/tailwind"; // Utility integration

/**
 * Escapes Mermaid special characters with production-grade safety
 */
function escapeMermaidLabel(text: string): string {
  return text
    .replace(/"/g, '\\"')           // Double quotes → escaped
    .replace(/`/g, "&#96;")         // Backticks → HTML entity
    .replace(/\[/g, "(")            // [ → (
    .replace(/\]/g, ")")            // ] → )
    .replace(/[\r\n]+/g, " ")       // Newlines → single space
    .replace(/ {2,}/g, " ")         // Collapse whitespace
    .replace(/</g, "&lt;")          // HTML safety
    .replace(/>/g, "&gt;");         // HTML safety
}

interface MermaidStyle {
  fill: string;
  stroke: string;
  strokeWidth: string;
  color: string;
  strokeDasharray?: string;
}

/**
 * Glassmorphic Mermaid Exporter - Copy-paste ready for GitHub/Notion
 */
export const PlanExporter = {
  /**
   * Generates production Mermaid flowchart matching your glassmorphic theme
   * Usage: Copy output → mermaid.live or GitHub README.md
   */
  toMermaid(plan: Plan): string {
    if (!plan.tasks?.length) {
      return `graph TD
  A["No tasks in plan"]
  classDef empty fill:#1e293b,stroke:#475569,color:#94a3b8`;
    }

    let mermaid = `\
graph TD
  %% Atlas v3.2.1 - Glassmorphic Strategic Roadmap
  %% Generated: ${new Date().toISOString().split('T')[0]}
`;

    // Glassmorphic Tailwind-inspired theme
    const glassStyles: Record<TaskStatus | Priority | string, Partial<MermaidStyle>> = {
      // Status (primary fill + glass effect)
      [TaskStatus.PENDING]: {
        fill: "#0f172a80",      // glass-1
        stroke: "#334155cc",    // slate-600/80
        strokeWidth: "2px",
        color: "#94a3b8",
      },
      [TaskStatus.IN_PROGRESS]: {
        fill: "#1e40af40",      // atlas-blue/25
        stroke: "#3b82f6",
        strokeWidth: "3px",
        color: "#ffffff",
        strokeDasharray: "5,5",
      },
      [TaskStatus.COMPLETED]: {
        fill: "#04785740",      // emerald/25  
        stroke: "#10b981",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      [TaskStatus.FAILED]: {
        fill: "#991b1b40",      // rose/25
        stroke: "#ef4444",
        strokeWidth: "3px",
        color: "#fee2e2",
      },
      [TaskStatus.BLOCKED]: {
        fill: "#1e293b80",
        stroke: "#475569",
        strokeWidth: "2px",
        color: "#64748b",
      },
      [TaskStatus.WAITING]: {
        fill: "#92400e40",      // amber/25
        stroke: "#f59e0b",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      // Priority borders (secondary)
      [Priority.HIGH]: { stroke: "#ef4444", strokeWidth: "4px" },
      [Priority.MEDIUM]: { stroke: "#f59e0b", strokeWidth: "3px" },
      [Priority.LOW]: { stroke: "#3b82f6", strokeWidth: "2px" },
      // Theme accents
      "AI": { stroke: "#3b82f6", strokeDasharray: "3 3" },
      "Cyber": { stroke: "#ef4444" },
      "ESG": { stroke: "#10b981" },
      "Global": { stroke: "#8b5cf6" },
      "Infra": { stroke: "#f59e0b" },
      "People": { stroke: "#ec4899" },
    };

    // Define glassmorphic classes
    Object.entries(glassStyles).forEach(([key, style]) => {
      mermaid += `  classDef ${key.toLowerCase()} `;
      Object.entries(style).forEach(([prop, value]) => {
        mermaid += `${prop}:${value},`;
      });
      mermaid = mermaid.slice(0, -1) + "\n";
    });

    // Generate nodes + edges (topological order)
    plan.tasks.forEach((task, index) => {
      const shortId = task.id.slice(-4);
      const escapedDesc = escapeMermaidLabel(task.description);
      
      // Glassmorphic node with theme accent
      mermaid += `  ${task.id}["#${shortId}\\n${escapedDesc}"]`;
      mermaid += `:::${task.status.toLowerCase()}`;
      mermaid += `:::${task.priority.toLowerCase()}`;
      
      // Theme styling
      if (task.theme) {
        mermaid += `:::${task.theme.toLowerCase()}`;
      }
      
      mermaid += "\n";

      // Dependency edges with status coloring
      if (task.dependencies?.length) {
        task.dependencies.forEach(depId => {
          const edgeClass = task.status === TaskStatus.COMPLETED 
            ? ":::edge-complete" 
            : task.status === TaskStatus.IN_PROGRESS
              ? ":::edge-active"
              : "";
          
          mermaid += `  ${depId} ${edgeClass}--> ${task.id}\n`;
        });
      }
    });

    // Edge styling
    mermaid += `
  %% Glassmorphic edge styles
  classDef edge-complete stroke:#10b981,stroke-width:3px,stroke-dasharray:0 0
  classDef edge-active stroke:#3b82f6,stroke-width:4px,stroke-dasharray:10 5
  classDef edge-pending stroke:#64748b,stroke-width:2px,stroke-dasharray:5 5
`;

    // Legend
    mermaid += `
  %% Legend
  legend[Legend]
  legend:::title
  status[Status]
  status:::pending
  priority[Priority]
  priority:::high
`;

    return mermaid;
  },

  /**
   * GitHub-Flavored Markdown Table - Copy-paste ready
   */
  toMarkdownTable(plan: Plan): string {
    if (!plan.tasks?.length) {
      return "| ID | Theme | Priority | Status | Category | Dependencies |\n|-----|-------|----------|---------|----------|--------------|\n| *(No tasks)* | | | | |";
    }

    const headers = "| ID | Theme | Priority | Status | Category | Dependencies |";
    const separator = "|----|-------|----------|--------|----------|--------------|";
    
    const rows = plan.tasks.map(task => {
      const deps = task.dependencies?.slice(0, 3).join(", ") || "-";
      const depCount = task.dependencies?.length || 0;
      const depsDisplay = deps === "-" ? "-" : `${deps}${depCount > 3 ? ` +${depCount-3}` : ""}`;
      
      return `| ${task.id} | ${task.theme || "-"} | ${task.priority} | ${task.status} | ${task.category || "-"} | ${depsDisplay} |`;
    });

    return [headers, separator, ...rows].join("\n");
  },

  /**
   * GitHub Actions + Jira Import JSON
   */
  toJSON(plan: Plan): string {
    const exportable = {
      ...plan,
      tasks: plan.tasks?.map(({ id, description, status, priority, category, theme, dependencies }) => ({
        id,
        description,
        status,
        priority,
        category: category || "Uncategorized",
        theme: theme || "General",
        dependencies: dependencies || [],
        exported: false, // GitHub/Jira sync flag
      })),
      exportDate: new Date().toISOString(),
      stats: {
        total: plan.tasks?.length || 0,
        highPriority: plan.tasks?.filter(t => t.priority === Priority.HIGH).length || 0,
        pending: plan.tasks?.filter(t => t.status === TaskStatus.PENDING).length || 0,
      }
    };
    
    return JSON.stringify(exportable, null, 2);
  },

  /**
   * GitHub README.md section - Copy-paste ready
   */
  toReadmeSection(plan: Plan): string {
    const stats = {
      total: plan.tasks?.length || 0,
      q1: plan.tasks?.filter(t => t.category?.includes("Q1")).length || 0,
      high: plan.tasks?.filter(t => t.priority === Priority.HIGH).length || 0,
    };

    return `\
## 📊 ${plan.name || "Atlas 2026 Roadmap"} Overview

**${stats.total} Tasks • ${stats.q1} Q1 Critical • ${stats.high} HIGH Priority**

\`\`\`
${this.toMarkdownTable(plan).slice(0, 2000)}...
\`\`\`

<details>
<summary>📈 Interactive Mermaid Diagram (Click to Expand)</summary>

\`\`\`mermaid
${this.toMermaid(plan)}
\`\`\`

</details>

<details>
<summary>⚙️ JSON Export (GitHub Actions/Jira)</summary>

\`\`\`json
${this.toJSON(plan).slice(0, 3000)}...
\`\`\`

</details>`;
  },
} as const;

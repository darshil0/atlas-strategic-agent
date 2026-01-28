import { Plan, TaskStatus, Priority } from "../../types";

/**
 * Escapes special characters for safe Mermaid label rendering
 * Handles quotes, backticks, brackets, parentheses, and newlines
 */
function escapeMermaidLabel(text: string): string {
  return text
    .replace(/"/g, '\\"')
    .replace(/`/g, "&#96;")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/[\r\n]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

interface MermaidStyle {
  fill: string;
  stroke: string;
  strokeWidth: string;
  color: string;
  strokeDasharray?: string;
}

/**
 * PlanExporter: Converts Atlas Plans to Mermaid.js diagrams for external tools
 * Usage: Copy-paste output into mermaid.live or GitHub markdown
 */
export const PlanExporter = {
  /**
   * Generates production-ready Mermaid flowchart from Plan
   */
  toMermaid(plan: Plan): string {
    if (!plan.tasks || plan.tasks.length === 0) {
      return [
        "```mermaid",
        "graph TD",
        "  A[No tasks in plan]",
        "```",
      ].join("\n");
    }

    let mermaid = "```mermaid\ngraph TD\n";

    // Tailwind-inspired styles (string keys to avoid enum-number issues)
    const styles: Record<string, Partial<MermaidStyle>> = {
      pending: {
        fill: "#0f172a",
        stroke: "#475569",
        strokeWidth: "2px",
        color: "#94a3b8",
      },
      in_progress: {
        fill: "#1e293b",
        stroke: "#3b82f6",
        strokeWidth: "3px",
        color: "#ffffff",
        strokeDasharray: "5 5",
      },
      completed: {
        fill: "#064e3b",
        stroke: "#10b981",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      failed: {
        fill: "#450a0a",
        stroke: "#ef4444",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      blocked: {
        fill: "#1e1b4b",
        stroke: "#64748b",
        strokeWidth: "2px",
        color: "#94a3b8",
      },
      waiting: {
        fill: "#451a03",
        stroke: "#f59e0b",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      high: { stroke: "#ef4444", strokeWidth: "3px" },
      medium: { stroke: "#f59e0b", strokeWidth: "2px" },
      low: { stroke: "#3b82f6", strokeWidth: "2px" },
    };

    // Generate style definitions
    for (const [key, style] of Object.entries(styles)) {
      mermaid += `  classDef ${key} `;
      for (const [prop, value] of Object.entries(style)) {
        mermaid += `${prop}:${value},`;
      }
      // Remove trailing comma
      mermaid = mermaid.slice(0, -1) + "\n";
    }

    const allIds = new Set(plan.tasks.map((t) => t.id));

    // Generate nodes and edges
    for (const task of plan.tasks) {
      const escapedDesc = escapeMermaidLabel(task.description ?? "");
      const displayId = task.id.slice(-4);

      mermaid += `  ${task.id}[#${displayId}\\n${escapedDesc}]`;

      // Status class (normalize to lower-case string)
      const statusClass = String(task.status).toLowerCase();
      mermaid += `:::${statusClass}`;

      // Priority class if present
      if (task.priority != null) {
        const priorityClass = String(task.priority).toLowerCase();
        mermaid += `:::${priorityClass}`;
      }

      mermaid += "\n";

      if (task.dependencies && task.dependencies.length > 0) {
        for (const depId of task.dependencies) {
          if (!allIds.has(depId)) continue;
          mermaid += `  ${depId} --> ${task.id}`;
          const edgeStyle =
            task.status === TaskStatus.COMPLETED
              ? ":::edge-completed"
              : task.status === TaskStatus.IN_PROGRESS
                ? ":::edge-progress"
                : "";
          if (edgeStyle) mermaid += edgeStyle;
          mermaid += "\n";
        }
      }
    }

    // Edge styling
    mermaid +=
      "  classDef edge-completed stroke:#10b981,stroke-width:2px,stroke-dasharray:0 0;\n" +
      "  classDef edge-progress stroke:#3b82f6,stroke-width:3px,stroke-dasharray:10 5;\n";

    // Plan title style and assignment
    mermaid +=
      "  classDef title fill:#1e293b,stroke:#3b82f6,stroke-width:0px,color:#ffffff,font-weight:bold;\n";
    mermaid += `  class ${plan.tasks.map((t) => t.id).join(" ")} title;\n`;

    mermaid += "```";
    return mermaid;
  },

  /**
   * Generates GitHub-flavored markdown table from Plan
   */
  toMarkdownTable(plan: Plan): string {
    if (!plan.tasks || plan.tasks.length === 0) {
      return "| No tasks |\n|----------|";
    }

    const headers = "| ID | Priority | Status | Category | Dependencies |";
    const separator = "|----|----------|--------|----------|--------------|";

    const rows = plan.tasks.map((task) => {
      const deps =
        task.dependencies && task.dependencies.length > 0
          ? task.dependencies.join(", ")
          : "-";
      const category =
        (task as any).category != null && (task as any).category !== ""
          ? (task as any).category
          : "-"; // adjust typing if Plan has category
      return `| #${task.id.slice(-4)} | ${task.priority ?? "-"} | ${task.status
        } | ${category} | ${deps} |`;
    });

    return [headers, separator, ...rows].join("\n");
  },

  /**
   * Generates JSON export for external systems
   */
  toJSON(plan: Plan): string {
    return JSON.stringify(plan, null, 2);
  },
} as const;

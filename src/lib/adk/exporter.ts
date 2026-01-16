import { Plan, TaskStatus, Priority } from "../../types";

/**
 * Escapes special characters for safe Mermaid label rendering
 * Handles quotes, brackets, parentheses, and newlines
 */
function escapeMermaidLabel(text: string): string {
  return text
    .replace(/"/g, '"')      // Double quotes → escaped
    .replace(/`/g, "&#96;")  // Backticks → HTML entity
    .replace(/\[/g, "(")     // [ → (
    .replace(/\]/g, ")")     // ] → )
    .replace(/[\r\n]+/g, " ") // Newlines → spaces
    .replace(/ {2,}/g, " "); // Collapse multiple spaces
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
    if (!plan.tasks?.length) {
      return "graph TD\n  A[No tasks in plan]";
    }

    let mermaid = "```mermaid\ngraph TD\n";

    // Define comprehensive Tailwind-inspired styles
    const styles: Record<TaskStatus | Priority, Partial<MermaidStyle>> = {
      [TaskStatus.PENDING]: {
        fill: "#0f172a",
        stroke: "#475569",
        strokeWidth: "2px",
        color: "#94a3b8",
      },
      [TaskStatus.IN_PROGRESS]: {
        fill: "#1e293b",
        stroke: "#3b82f6",
        strokeWidth: "3px",
        color: "#ffffff",
        strokeDasharray: "5 5",
      },
      [TaskStatus.COMPLETED]: {
        fill: "#064e3b",
        stroke: "#10b981",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      [TaskStatus.FAILED]: {
        fill: "#450a0a",
        stroke: "#ef4444",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      [TaskStatus.BLOCKED]: {
        fill: "#1e1b4b",
        stroke: "#64748b",
        strokeWidth: "2px",
        color: "#94a3b8",
      },
      [TaskStatus.WAITING]: {
        fill: "#451a03",
        stroke: "#f59e0b",
        strokeWidth: "2px",
        color: "#ffffff",
      },
      [Priority.HIGH]: { stroke: "#ef4444", strokeWidth: "3px" },
      [Priority.MEDIUM]: { stroke: "#f59e0b", strokeWidth: "2px" },
      [Priority.LOW]: { stroke: "#3b82f6", strokeWidth: "2px" },
    };

    // Generate style definitions
    Object.entries(styles).forEach(([key, style]) => {
      if (typeof key === "string") {
        mermaid += `  classDef ${key.toLowerCase()} `;
        Object.entries(style).forEach(([prop, value]) => {
          mermaid += `${prop}:${value},`;
        });
        mermaid = mermaid.slice(0, -1) + "\n"; // Remove trailing comma
      }
    });

    // Generate nodes and edges
    plan.tasks.forEach((task) => {
      const escapedDesc = escapeMermaidLabel(task.description);
      const displayId = task.id.slice(-4); // Short ID for display

      // Node with status + priority styling
      mermaid += `  ${task.id}[#${displayId}\\n${escapedDesc}]`;

      // Apply status styling (primary)
      mermaid += `:::${task.status.toLowerCase()}`;

      // Apply priority border styling (secondary)
      if (task.priority) {
        mermaid += `:::${task.priority.toLowerCase()}`;
      }

      mermaid += "\n";

      // Generate dependency edges
      if (task.dependencies?.length) {
        task.dependencies.forEach((depId) => {
          mermaid += `  ${depId} --> ${task.id}`;

          // Color-code edges by status
          const edgeStyle = task.status === TaskStatus.COMPLETED
            ? ":::edge-completed"
            : task.status === TaskStatus.IN_PROGRESS
              ? ":::edge-progress"
              : "";

          if (edgeStyle) mermaid += edgeStyle;
          mermaid += "\n";
        });
      }
    });

    // Edge styling
    mermaid += `
  classDef edge-completed stroke:#10b981,stroke-width:2px,stroke-dasharray: 0 0;
  classDef edge-progress stroke:#3b82f6,stroke-width:3px,stroke-dasharray: 10 5;
`;

    // Plan title
    mermaid += `  classDef title fill:#1e293b,stroke:#3b82f6,stroke-width:0px,color:#ffffff,font-weight:bold;
  class ${plan.tasks.map(t => t.id).join(" ")} title;
`;

    mermaid += "```";
    return mermaid;
  },

  /**
   * Generates GitHub-flavored markdown table from Plan
   */
  toMarkdownTable(plan: Plan): string {
    if (!plan.tasks?.length) return "| No tasks |\n|----------|";

    const headers = "| ID | Priority | Status | Category | Dependencies |";
    const separator = "|----|----------|--------|----------|--------------|";

    const rows = plan.tasks.map(task =>
      `| #${task.id.slice(-4)} | ${task.priority} | ${task.status} | ${task.category} | ${task.dependencies?.join(", ") || "-"} |`
    );

    return [headers, separator, ...rows].join("\n");
  },

  /**
   * Generates JSON export for external systems
   */
  toJSON(plan: Plan): string {
    return JSON.stringify(plan, null, 2);
  },
} as const;

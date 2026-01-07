import { Plan, SubTask, TaskStatus } from "../../types";

function escapeMermaidLabel(text: string): string {
  // Basic hardening: replace double quotes and backticks which can break Mermaid label syntax
  return text.replace(/["`]/g, "'");
}

export const PlanExporter = {
  /**
   * Generates Mermaid.js flow diagram code from a Plan
   */
  toMermaid(plan: Plan): string {
    let mermaid = "graph TD\n";

    // Styling
    mermaid +=
      "  classDef pending fill:#0f172a,stroke:#334155,stroke-width:2px,color:#94a3b8;\n";
    mermaid +=
      "  classDef progress fill:#1e293b,stroke:#3b82f6,stroke-width:3px,color:#fff,stroke-dasharray: 5 5;\n";
    mermaid +=
      "  classDef completed fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;\n";
    mermaid +=
      "  classDef failed fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#fff;\n";

    plan.tasks.forEach((task: SubTask) => {
      const escapedDesc = escapeMermaidLabel(task.description);
      mermaid += `  ${task.id}["#${task.id}: ${escapedDesc}"]\n`;

      if (task.status === TaskStatus.COMPLETED) {
        mermaid += `  class ${task.id} completed\n`;
      } else if (task.status === TaskStatus.IN_PROGRESS) {
        mermaid += `  class ${task.id} progress\n`;
      } else if (task.status === TaskStatus.FAILED) {
        mermaid += `  class ${task.id} failed\n`;
      } else {
        mermaid += `  class ${task.id} pending\n`;
      }

      if (task.dependencies?.length) {
        task.dependencies.forEach((depId: string) => {
          mermaid += `  ${depId} --> ${task.id}\n`;
        });
      }
    });

    return mermaid;
  },
};

import { Plan, SubTask, TaskStatus } from "../../types";

export const PlanExporter = {
    /**
     * Generates Mermaid.js flow diagram code from a Plan
     */
    toMermaid(plan: Plan): string {
        let mermaid = "graph TD\n";

        // Styling
        mermaid += "  classDef pending fill:#0f172a,stroke:#334155,stroke-width:2px,color:#94a3b8;\n";
        mermaid += "  classDef progress fill:#1e293b,stroke:#3b82f6,stroke-width:3px,color:#fff,stroke-dasharray: 5 5;\n";
        mermaid += "  classDef completed fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;\n";
        mermaid += "  classDef failed fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#fff;\n";

        plan.tasks.forEach(task => {
            const escapedDesc = task.description.replace(/"/g, "'");
            mermaid += `  ${task.id}["#${task.id}: ${escapedDesc}"]\n`;

            // Apply class based on status
            if (task.status === TaskStatus.COMPLETED) mermaid += `  class ${task.id} completed\n`;
            else if (task.status === TaskStatus.IN_PROGRESS) mermaid += `  class ${task.id} progress\n`;
            else if (task.status === TaskStatus.FAILED) mermaid += `  class ${task.id} failed\n`;
            else mermaid += `  class ${task.id} pending\n`;

            // Dependencies
            if (task.dependencies) {
                task.dependencies.forEach(depId => {
                    mermaid += `  ${depId} --> ${task.id}\n`;
                });
            }
        });

        return mermaid;
    },

    /**
     * Simple parser to try and extract a Plan skeleton from Mermaid code
     * (Very basic implementation for initial V3 prototype)
     */
    fromMermaid(mermaid: string): Partial<Plan> {
        const lines = mermaid.split("\n");
        const tasks: SubTask[] = [];
        const dependencyMap: Record<string, string[]> = {};

        lines.forEach(line => {
            // Extract task definition: taskID["Description"]
            const nodeMatch = line.match(/^\s*(\w+)\["(.+)"\]/);
            if (nodeMatch && nodeMatch[1] && nodeMatch[2]) {
                const id = nodeMatch[1];
                const desc = nodeMatch[2];
                tasks.push({
                    id,
                    description: desc.split(": ").slice(1).join(": ") || desc,
                    status: TaskStatus.PENDING,
                    priority: (idx => (idx % 3 === 0 ? "high" : idx % 2 === 0 ? "medium" : "low"))(tasks.length) as any,
                    dependencies: []
                });
            }

            // Extract dependencies: source --> target
            const edgeMatch = line.match(/^\s*(\w+)\s*-->\s*(\w+)/);
            if (edgeMatch && edgeMatch[1] && edgeMatch[2]) {
                const source = edgeMatch[1];
                const target = edgeMatch[2];
                dependencyMap[target] ||= [];
                dependencyMap[target].push(source);
            }
        });

        tasks.forEach(t => {
            if (dependencyMap[t.id]) {
                t.dependencies = dependencyMap[t.id];
            }
        });

        return {
            projectName: "Imported Strategic Plan",
            goal: "Imported roadmap via Mermaid syntax",
            tasks
        };
    }
};

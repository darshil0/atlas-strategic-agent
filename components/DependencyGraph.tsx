import React, { useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Handle,
  Position,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  MiniMap,
  Controls,
} from "reactflow";
import { SubTask, TaskStatus, Priority } from "../types";
import "reactflow/dist/style.css";

// Custom node component for each strategic task
const TaskNode = ({
  data,
}: {
  data: {
    task: SubTask;
    isActive: boolean;
    isBlocked: boolean;
    onNodeClick: (id: string) => void;
  };
}) => {
  const { task, isActive, isBlocked, onNodeClick } = data;

  const getStatusStyles = () => {
    if (isBlocked && task.status === TaskStatus.PENDING)
      return "border-slate-800 bg-slate-900/80 opacity-50 grayscale-[0.5] cursor-not-allowed";

    switch (task.status) {
      case TaskStatus.COMPLETED:
        return "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.05)]";
      case TaskStatus.FAILED:
        return "border-rose-500/20 bg-rose-500/5";
      case TaskStatus.IN_PROGRESS:
        return "border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]";
      default:
        return "border-slate-700 bg-slate-800/80 hover:border-slate-600";
    }
  };

  const getPriorityAccent = () => {
    switch (task.priority) {
      case Priority.HIGH:
        return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]";
      case Priority.MEDIUM:
        return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
      default:
        return "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]";
    }
  };

  return (
    <div
      onClick={() => onNodeClick(task.id)}
      className={`flex rounded-xl border text-[10px] w-48 overflow-hidden transition-all duration-500 backdrop-blur-sm select-none ${getStatusStyles()
        } ${isActive ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 scale-105 z-40 shadow-2xl shadow-blue-500/20" : ""}`}
    >
      <div className={`w-1.5 shrink-0 ${getPriorityAccent()}`} />
      <div className="flex-1 px-3 py-2.5 relative">
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center opacity-60 font-mono text-[7px] tracking-widest uppercase">
            <span className="bg-slate-950/50 px-1 rounded">#{task.id}</span>
            <span className="truncate max-w-[80px]">
              {task.category || "Strategic"}
            </span>
          </div>
          <p
            className={`font-semibold leading-snug line-clamp-2 min-h-[2.4em] ${task.status === TaskStatus.COMPLETED
                ? "text-slate-500"
                : "text-slate-100"
              }`}
          >
            {task.description}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1 h-1 rounded-full ${task.status === TaskStatus.IN_PROGRESS
                    ? "animate-pulse bg-blue-400"
                    : "bg-slate-600"
                  }`}
              ></span>
              <span className="text-[7px] uppercase font-black tracking-tighter text-slate-500">
                {task.status.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>
    </div>
  );
};

const nodeTypes = { taskNode: TaskNode };

interface DependencyGraphProps {
  tasks: SubTask[];
  activeTaskId: string | null;
  onTaskSelect: (id: string) => void;
  isTaskBlocked: (task: SubTask, allTasks: SubTask[]) => boolean;
  onConnect?: (source: string, target: string) => void;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({
  tasks,
  activeTaskId,
  onTaskSelect,
  isTaskBlocked,
}) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    const depths: Record<string, number> = {};

    const getDepth = (id: string, visited = new Set<string>()): number => {
      if (visited.has(id)) return 0;
      if (depths[id] !== undefined) return depths[id];

      const task = tasks.find((t) => t.id === id);
      if (!task || !task.dependencies?.length) {
        depths[id] = 0;
        return 0;
      }

      visited.add(id);
      const depDepths = task.dependencies.map((dep) =>
        getDepth(dep, new Set(visited))
      );
      const depth = Math.max(...depDepths, 0) + 1;
      depths[id] = depth;
      return depth;
    };

    // Group tasks by dependency depth
    tasks.forEach((t) => getDepth(t.id));
    const depthGroups: Record<number, string[]> = {};
    Object.entries(depths).forEach(([id, depth]) => {
      (depthGroups[depth] ??= []).push(id);
    });

    // Build nodes
    const nodes: Node[] = tasks.map((task) => {
      const depth = depths[task.id] || 0;
      const group = depthGroups[depth];
      const i = group.indexOf(task.id);
      const offset = (i - (group.length - 1) / 2) * 240;

      return {
        id: task.id,
        type: "taskNode",
        position: { x: offset, y: depth * 160 },
        data: {
          task,
          isActive: activeTaskId === task.id,
          isBlocked: isTaskBlocked(task, tasks),
          onNodeClick: onTaskSelect,
        },
      };
    });

    // Build edges
    const edges: Edge[] = [];
    for (const task of tasks) {
      for (const depId of task.dependencies ?? []) {
        const dep = tasks.find((t) => t.id === depId);
        const complete = dep?.status === TaskStatus.COMPLETED;
        edges.push({
          id: `e-${depId}-${task.id}`,
          source: depId,
          target: task.id,
          animated: complete,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: complete ? "#10b981" : "#334155",
          },
          style: {
            stroke: complete ? "#10b981" : "#334155",
            strokeWidth: complete ? 2 : 1.5,
            opacity: complete ? 1 : 0.4,
          },
        });
      }
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [tasks, activeTaskId, onTaskSelect, isTaskBlocked]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="h-full min-h-[500px] w-full border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 relative group">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e293b"
        />
        <MiniMap
          nodeColor={(n) => {
            const t = n.data?.task as SubTask;
            if (t?.status === TaskStatus.COMPLETED) return "#10b981";
            if (t?.status === TaskStatus.IN_PROGRESS) return "#3b82f6";
            return "#1e293b";
          }}
          maskColor="rgba(15,23,42,0.7)"
          className="!bg-slate-900 !border-slate-800 rounded-lg overflow-hidden"
          style={{ height: 100, width: 150 }}
        />
        <Controls className="!bg-slate-900 !border-slate-800 !shadow-none" />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;

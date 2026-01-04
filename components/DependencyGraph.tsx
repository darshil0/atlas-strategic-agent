
import React, { useMemo, useEffect } from 'react';
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
  Controls
} from 'reactflow';
import { SubTask, TaskStatus, Priority } from '../types';

const TaskNode = ({ data }: { data: { task: SubTask; isActive: boolean; isBlocked: boolean; onNodeClick: (id: string) => void } }) => {
  const { task, isActive, isBlocked, onNodeClick } = data;
  
  const getStatusStyles = () => {
    if (isBlocked && task.status === TaskStatus.PENDING) {
      return 'border-slate-800 bg-slate-900/80 opacity-60 grayscale-[0.5] cursor-not-allowed';
    }
    switch (task.status) {
      case TaskStatus.COMPLETED: 
        return 'border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.05)] cursor-pointer';
      case TaskStatus.FAILED: 
        return 'border-rose-500/20 bg-rose-500/5 cursor-pointer';
      case TaskStatus.IN_PROGRESS: 
        return 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] cursor-pointer';
      default: 
        return 'border-slate-700 bg-slate-800/80 hover:border-slate-600 cursor-pointer';
    }
  };

  const getPriorityAccent = () => {
    switch (task.priority) {
      case Priority.HIGH: return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      case Priority.MEDIUM: return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      case Priority.LOW: return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div 
      onClick={() => onNodeClick(task.id)}
      className={`flex rounded-xl border text-[10px] w-48 transition-all duration-500 overflow-hidden backdrop-blur-sm ${getStatusStyles()} ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 scale-105 z-50 shadow-2xl shadow-blue-500/20' : ''}`}
    >
      <div className={`w-1.5 shrink-0 ${getPriorityAccent()}`}></div>
      <div className="flex-1 px-3 py-2.5 relative">
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center opacity-60 font-mono text-[7px] tracking-widest uppercase">
            <span className="bg-slate-950/50 px-1 rounded">#{task.id}</span>
            <span className="truncate max-w-[80px]">{task.category || 'Strategic'}</span>
          </div>
          <p className={`font-semibold leading-snug line-clamp-2 min-h-[2.4em] ${task.status === TaskStatus.COMPLETED ? 'text-slate-500' : 'text-slate-100'}`}>
            {task.description}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
               <span className={`w-1 h-1 rounded-full ${task.status === TaskStatus.IN_PROGRESS ? 'animate-pulse bg-blue-400' : 'bg-slate-600'}`}></span>
               <span className="text-[7px] uppercase font-black tracking-tighter text-slate-500">
                {task.status.replace('-', ' ')}
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
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ tasks, activeTaskId, onTaskSelect, isTaskBlocked }) => {
  const nodesWithMetadata = useMemo(() => {
    const depths: Record<string, number> = {};
    const calculateDepth = (id: string, visited = new Set<string>()): number => {
      if (visited.has(id)) return 0;
      if (depths[id] !== undefined) return depths[id];
      const task = tasks.find(t => t.id === id);
      if (!task || !task.dependencies || task.dependencies.length === 0) {
        depths[id] = 0;
        return 0;
      }
      visited.add(id);
      const depDepths = task.dependencies.map(depId => calculateDepth(depId, new Set(visited)));
      depths[id] = Math.max(...depDepths) + 1;
      return depths[id];
    };

    tasks.forEach(t => calculateDepth(t.id));
    const depthGroups: Record<number, string[]> = {};
    Object.entries(depths).forEach(([id, depth]) => {
      if (!depthGroups[depth]) depthGroups[depth] = [];
      depthGroups[depth].push(id);
    });

    const initialNodes: Node[] = tasks.map((task) => {
      const depth = depths[task.id] || 0;
      const indexInDepth = depthGroups[depth].indexOf(task.id);
      const totalInDepth = depthGroups[depth].length;
      const xOffset = (indexInDepth - (totalInDepth - 1) / 2) * 240;
      
      return {
        id: task.id,
        type: 'taskNode',
        data: { 
          task, 
          isActive: activeTaskId === task.id,
          isBlocked: isTaskBlocked(task, tasks),
          onNodeClick: onTaskSelect
        },
        position: { x: xOffset, y: depth * 160 },
      };
    });

    const initialEdges: Edge[] = [];
    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          const depTask = tasks.find(t => t.id === depId);
          const isSourceComplete = depTask?.status === TaskStatus.COMPLETED;
          const isTargetProgressing = task.status === TaskStatus.IN_PROGRESS;

          initialEdges.push({
            id: `e-${depId}-${task.id}`,
            source: depId,
            target: task.id,
            animated: isSourceComplete && isTargetProgressing,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isSourceComplete ? '#10b981' : '#334155',
            },
            style: { 
              stroke: isSourceComplete ? '#10b981' : '#334155',
              strokeWidth: isSourceComplete ? 2 : 1.5,
              opacity: isSourceComplete ? 1 : 0.3
            }
          });
        });
      }
    });

    return { initialNodes, initialEdges };
  }, [tasks, activeTaskId, isTaskBlocked, onTaskSelect]);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithMetadata.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(nodesWithMetadata.initialEdges);

  useEffect(() => {
    setNodes(nodesWithMetadata.initialNodes);
    setEdges(nodesWithMetadata.initialEdges);
  }, [nodesWithMetadata, setNodes, setEdges]);

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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <MiniMap 
          nodeColor={(n) => {
            const task = n.data?.task as SubTask;
            if (task?.status === TaskStatus.COMPLETED) return '#10b981';
            if (task?.status === TaskStatus.IN_PROGRESS) return '#3b82f6';
            return '#1e293b';
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-slate-900 !border-slate-800 rounded-lg overflow-hidden"
          style={{ height: 100, width: 150 }}
        />
        <Controls className="!bg-slate-900 !border-slate-800 !shadow-none" />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;

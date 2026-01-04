
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
  MarkerType
} from 'reactflow';
import { SubTask, TaskStatus, Priority } from '../types';

// Custom Node Component to match Atlas Strategic aesthetic
const TaskNode = ({ data }: { data: { task: SubTask; isActive: boolean; isBlocked: boolean } }) => {
  const { task, isActive, isBlocked } = data;
  
  const getStatusStyles = () => {
    if (isBlocked && task.status === TaskStatus.PENDING) {
      return 'border-slate-800 bg-slate-900/80 opacity-60 grayscale-[0.5]';
    }
    switch (task.status) {
      case TaskStatus.COMPLETED: 
        return 'border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.05)]';
      case TaskStatus.FAILED: 
        return 'border-rose-500/20 bg-rose-500/5';
      case TaskStatus.IN_PROGRESS: 
        return 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]';
      default: 
        return 'border-slate-700 bg-slate-800/80 hover:border-slate-600';
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

  const getTextColor = () => {
    if (task.status === TaskStatus.COMPLETED) return 'text-slate-500';
    if (isBlocked) return 'text-slate-400';
    return 'text-slate-100';
  };

  return (
    <div className={`flex rounded-xl border text-[10px] w-48 transition-all duration-500 overflow-hidden backdrop-blur-sm ${getStatusStyles()} ${isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 scale-105 z-50' : ''}`}>
      {/* Priority Indicator Strip */}
      <div className={`w-1.5 shrink-0 ${getPriorityAccent()}`}></div>
      
      <div className="flex-1 px-3 py-2.5 relative">
        <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-700 border-none opacity-0" />
        
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center opacity-60 font-mono text-[7px] tracking-widest uppercase">
            <span className="bg-slate-950/50 px-1 rounded">#{task.id}</span>
            <span className="truncate max-w-[80px]">{task.category || 'Strategic'}</span>
          </div>
          
          <p className={`font-semibold leading-snug line-clamp-2 min-h-[2.4em] ${getTextColor()}`}>
            {task.description}
          </p>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
               <span className={`w-1 h-1 rounded-full ${task.status === TaskStatus.IN_PROGRESS ? 'animate-pulse bg-blue-400' : 'bg-slate-600'}`}></span>
               <span className="text-[7px] uppercase font-black tracking-tighter text-slate-500">
                {task.status.replace('-', ' ')}
               </span>
            </div>
            
            {isBlocked && task.status === TaskStatus.PENDING && (
              <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
        </div>
        
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-500 border-none opacity-0" />
      </div>
    </div>
  );
};

const nodeTypes = {
  taskNode: TaskNode,
};

interface DependencyGraphProps {
  tasks: SubTask[];
  activeTaskId: string | null;
  isTaskBlocked: (task: SubTask, allTasks: SubTask[]) => boolean;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ tasks, activeTaskId, isTaskBlocked }) => {
  // Enhanced layout logic: calculate depth of nodes and manage horizontal spacing
  const nodesWithMetadata = useMemo(() => {
    const depths: Record<string, number> = {};
    
    const calculateDepth = (id: string, visited = new Set<string>()): number => {
      if (visited.has(id)) return 0; // Prevent infinite loops in circular deps
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

    // Group by depth to set positions
    const depthGroups: Record<number, string[]> = {};
    Object.entries(depths).forEach(([id, depth]) => {
      if (!depthGroups[depth]) depthGroups[depth] = [];
      depthGroups[depth].push(id);
    });

    const initialNodes: Node[] = tasks.map((task) => {
      const depth = depths[task.id] || 0;
      const indexInDepth = depthGroups[depth].indexOf(task.id);
      const totalInDepth = depthGroups[depth].length;
      
      // Center the depth level
      const xOffset = (indexInDepth - (totalInDepth - 1) / 2) * 220;
      
      return {
        id: task.id,
        type: 'taskNode',
        data: { 
          task, 
          isActive: activeTaskId === task.id,
          isBlocked: isTaskBlocked(task, tasks)
        },
        position: { x: xOffset, y: depth * 140 },
      };
    });

    const initialEdges: Edge[] = [];
    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          const depTask = tasks.find(t => t.id === depId);
          const isSourceComplete = depTask?.status === TaskStatus.COMPLETED;
          const isTargetNext = task.status === TaskStatus.IN_PROGRESS || (task.status === TaskStatus.PENDING && !isTaskBlocked(task, tasks));

          initialEdges.push({
            id: `e-${depId}-${task.id}`,
            source: depId,
            target: task.id,
            animated: isSourceComplete && isTargetNext,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 15,
              height: 15,
              color: isSourceComplete ? '#10b981' : '#334155',
            },
            style: { 
              stroke: isSourceComplete ? '#10b981' : '#334155',
              strokeWidth: isSourceComplete ? 2 : 1.5,
              opacity: isSourceComplete ? 1 : 0.4
            }
          });
        });
      }
    });

    return { initialNodes, initialEdges };
  }, [tasks, activeTaskId, isTaskBlocked]);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithMetadata.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(nodesWithMetadata.initialEdges);

  // Sync internal state with external props changes
  useEffect(() => {
    setNodes(nodesWithMetadata.initialNodes);
    setEdges(nodesWithMetadata.initialEdges);
  }, [nodesWithMetadata, setNodes, setEdges]);

  return (
    <div className="h-[500px] w-full border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-inner relative group">
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Neural Pathway Active</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={30} 
          size={1} 
          color="#1e293b" 
          className="opacity-20"
        />
      </ReactFlow>

      {/* Footer Legend */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-4 bg-slate-900/50 backdrop-blur px-4 py-2 rounded-full border border-slate-800/50 text-[8px] font-bold uppercase tracking-widest text-slate-500 pointer-events-none">
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> High</div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Mid</div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Low</div>
      </div>
    </div>
  );
};

export default DependencyGraph;

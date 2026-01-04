
import React, { useMemo, useEffect } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Handle, 
  Position, 
  Background, 
  BackgroundVariant,
  useNodesState,
  useEdgesState
} from 'reactflow';
import { SubTask, TaskStatus } from '../types';

// Custom Node Component to match TaskCard aesthetic
const TaskNode = ({ data }: { data: { task: SubTask; isActive: boolean; isBlocked: boolean } }) => {
  const { task, isActive, isBlocked } = data;
  
  const getStatusColor = () => {
    if (isBlocked && task.status === TaskStatus.PENDING) return 'border-slate-800 bg-slate-900 opacity-60';
    switch (task.status) {
      case TaskStatus.COMPLETED: return 'border-emerald-500/30 bg-emerald-500/10';
      case TaskStatus.FAILED: return 'border-rose-500/30 bg-rose-500/10';
      case TaskStatus.IN_PROGRESS: return 'border-blue-500/50 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      default: return 'border-blue-500/20 bg-slate-800';
    }
  };

  const getTextColor = () => {
    if (task.status === TaskStatus.COMPLETED) return 'text-slate-500';
    return 'text-slate-200';
  };

  return (
    <div className={`px-3 py-2 rounded-lg border text-[10px] w-40 transition-all ${getStatusColor()} ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center opacity-50 font-mono text-[8px]">
          <span>#{task.id}</span>
          <span className="uppercase">{task.category || 'General'}</span>
        </div>
        <p className={`font-medium leading-tight truncate ${getTextColor()}`}>
          {task.description}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
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
  // Simple layout logic: calculate depth of nodes
  const nodesWithMetadata = useMemo(() => {
    const depths: Record<string, number> = {};
    
    const calculateDepth = (id: string): number => {
      if (depths[id] !== undefined) return depths[id];
      const task = tasks.find(t => t.id === id);
      if (!task || !task.dependencies || task.dependencies.length === 0) {
        depths[id] = 0;
        return 0;
      }
      const depDepths = task.dependencies.map(calculateDepth);
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
      
      return {
        id: task.id,
        type: 'taskNode',
        data: { 
          task, 
          isActive: activeTaskId === task.id,
          isBlocked: isTaskBlocked(task, tasks)
        },
        position: { x: indexInDepth * 180, y: depth * 80 },
      };
    });

    const initialEdges: Edge[] = [];
    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          initialEdges.push({
            id: `e-${depId}-${task.id}`,
            source: depId,
            target: task.id,
            animated: tasks.find(t => t.id === depId)?.status === TaskStatus.COMPLETED && task.status === TaskStatus.IN_PROGRESS,
            style: { 
              stroke: tasks.find(t => t.id === depId)?.status === TaskStatus.COMPLETED ? '#10b981' : '#334155' 
            }
          });
        });
      }
    });

    return { initialNodes, initialEdges };
  }, [tasks, activeTaskId, isTaskBlocked]);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithMetadata.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(nodesWithMetadata.initialEdges);

  // Update nodes and edges when tasks change
  useEffect(() => {
    setNodes(nodesWithMetadata.initialNodes);
    setEdges(nodesWithMetadata.initialEdges);
  }, [nodesWithMetadata, setNodes, setEdges]);

  return (
    <div className="h-[400px] w-full border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#1e293b" />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;


import React, { useRef, useEffect } from 'react';
import { SubTask, TaskStatus, Priority } from '../types';
import { ICONS } from '../constants';

interface TaskCardProps {
  task: SubTask;
  isActive: boolean;
  isBlocked: boolean;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isActive, isBlocked, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isActive]);

  const getStatusIcon = (status: TaskStatus) => {
    if (isBlocked && status === TaskStatus.PENDING) {
      return (
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
    switch (status) {
      case TaskStatus.COMPLETED: return ICONS.COMPLETED;
      case TaskStatus.FAILED: return ICONS.FAILED;
      case TaskStatus.IN_PROGRESS: return ICONS.IN_PROGRESS;
      case TaskStatus.WAITING: return ICONS.WAITING;
      default: return ICONS.PENDING;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    if (isBlocked && status === TaskStatus.PENDING) {
      return 'border-slate-800 bg-slate-900 opacity-60';
    }
    switch (status) {
      case TaskStatus.COMPLETED: return 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50';
      case TaskStatus.FAILED: return 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50';
      case TaskStatus.IN_PROGRESS: return 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case TaskStatus.WAITING: return 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50';
      default: return 'border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20 hover:border-blue-500/50'; 
    }
  };

  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case Priority.MEDIUM: return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case Priority.LOW: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default: return 'text-slate-500 border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer group
        ${getStatusColor(task.status)} 
        ${isActive ? 'scale-[1.02] z-10 border-blue-400 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0 transition-transform duration-300 group-hover:scale-110">
          {getStatusIcon(task.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className={`text-sm font-medium leading-tight transition-colors duration-300 ${task.status === TaskStatus.COMPLETED ? 'text-slate-400 line-through' : 'text-slate-200 group-hover:text-white'}`}>
              {task.description}
            </p>
            <span className="text-[10px] font-mono text-slate-500 ml-2 group-hover:text-slate-400">#{task.id}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 items-center">
            {task.priority && (
              <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            )}
            {task.category && (
              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-wider border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                {task.category}
              </span>
            )}
            {task.dependencies && task.dependencies.length > 0 && (
              <div className="flex gap-1 items-center">
                <span className="text-[9px] uppercase tracking-tighter font-bold text-slate-600">Needs:</span>
                {task.dependencies.map(depId => (
                  <span key={depId} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-mono border border-slate-700 transition-colors group-hover:border-slate-600">
                    #{depId}
                  </span>
                ))}
              </div>
            )}
          </div>

          {task.status === TaskStatus.IN_PROGRESS && (
            <div className="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]"></div>
            </div>
          )}
          
          {!isBlocked && task.status === TaskStatus.PENDING && (
            <div className="mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Ready to run</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

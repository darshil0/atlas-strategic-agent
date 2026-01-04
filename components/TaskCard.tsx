import React, { useRef, useEffect, useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      setIsExpanded(true);
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
      default: return 'border-slate-800 bg-slate-900/50 hover:border-slate-700'; 
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
      className={`rounded-xl border transition-all duration-300 group overflow-hidden
        ${getStatusColor(task.status)} 
        ${isActive ? 'scale-[1.02] z-10 border-blue-400 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10' : 'hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/5'}
      `}
    >
      <div 
        onClick={onClick}
        className="p-3 cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0 transition-transform duration-300 group-hover:scale-110">
            {getStatusIcon(task.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className={`text-sm font-semibold leading-tight transition-colors duration-300 ${task.status === TaskStatus.COMPLETED ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'}`}>
                {task.description}
              </p>
              <span className="text-[10px] font-mono text-slate-600 ml-2 group-hover:text-slate-400 shrink-0 uppercase">#{task.id}</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {task.priority && (
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              )}
              {task.category && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                  {task.category}
                </span>
              )}
              {task.dependencies && task.dependencies.length > 0 && (
                <div className="flex gap-1 items-center">
                  <span className="text-[9px] uppercase tracking-tighter font-bold text-slate-600">Needs:</span>
                  {task.dependencies.map(depId => (
                    <span key={depId} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[9px] font-mono border border-slate-700 transition-colors group-hover:border-slate-600">
                      #{depId}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {task.status === TaskStatus.IN_PROGRESS && (
              <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]"></div>
              </div>
            )}
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {!isBlocked && task.status === TaskStatus.PENDING && (
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-blue-500/5 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Autonomous Ready</span>
                  </div>
                )}
              </div>
              
              {(task.result || task.status === TaskStatus.IN_PROGRESS) && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${isExpanded ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {isExpanded ? 'Seal' : 'Declassify'}
                  <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (task.result || task.status === TaskStatus.IN_PROGRESS) && (
        <div className="border-t border-slate-800 bg-slate-950/50 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operation Log</span>
          </div>
          <div className="prose prose-invert prose-xs max-w-none text-slate-400 text-[11px] leading-relaxed font-mono whitespace-pre-wrap mb-3">
            {task.result || (
              <div className="flex items-center gap-2 italic">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                Analyzing dependencies...
              </div>
            )}
          </div>
          
          {task.citations && task.citations.length > 0 && (
            <div className="pt-3 border-t border-slate-800/50">
              <p className="text-[9px] font-black uppercase text-slate-600 mb-2 tracking-widest">Grounding Citations</p>
              <div className="flex flex-wrap gap-2">
                {task.citations.map((citation, idx) => (
                  <a 
                    key={idx}
                    href={citation.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-[10px] text-blue-400 transition-all truncate max-w-[200px]"
                  >
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {citation.title || citation.uri}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
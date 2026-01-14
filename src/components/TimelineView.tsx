import React from "react";
import { motion } from "framer-motion";
import { Plan, SubTask, TaskStatus } from "../types";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimelineViewProps {
  plan: Plan;
  activeTaskId: string | null;
}

const TimelineView: React.FC<TimelineViewProps> = ({ plan, activeTaskId }) => {
  const sortedTasks = React.useMemo(
    () => [...plan.tasks].sort((a: SubTask, b: SubTask) => a.id.localeCompare(b.id)),
    [plan.tasks]
  );

  const getStatusColor = (task: SubTask) => {
    const isActive = activeTaskId === task.id;
    const isBlocked = task.status === TaskStatus.PENDING && task.dependencies?.length > 0;

    if (isBlocked) {
      return "border-slate-800/60 bg-slate-900/40 text-slate-500 opacity-70";
    }
    
    switch (task.status) {
      case TaskStatus.COMPLETED:
        return "bg-emerald-500/15 border-emerald-500/50 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-600/20 border-blue-500/60 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] animate-pulse";
      case TaskStatus.WAITING:
        return "bg-amber-500/10 border-amber-500/40 text-amber-400";
      default:
        return "bg-slate-900/50 border-slate-800/60 text-slate-400";
    }
  };

  return (
    <div 
      className="h-full overflow-y-auto overflow-x-hidden p-8 bg-slate-950/60 rounded-3xl border border-slate-900/50 backdrop-blur-xl no-scrollbar shadow-2xl"
      role="region"
      aria-label="Task timeline"
      tabIndex={-1}
    >
      <div className="relative min-h-full">
        {/* Timeline connector */}
        <div 
          className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-slate-800/50 to-transparent shadow-sm"
          aria-hidden="true"
          role="presentation"
        />

        <ol className="space-y-10 relative" role="list">
          {sortedTasks.map((task: SubTask, index: number) => {
            const isActive = activeTaskId === task.id;
            const isLast = index === sortedTasks.length - 1;

            return (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex gap-6 items-start transition-all duration-500 group",
                  isActive && "translate-x-4 [&>*]:ring-2 [&>*]:ring-blue-500/30"
                )}
                id={`timeline-task-${task.id}`}
              >
                {/* Timeline marker */}
                <div 
                  className="relative z-20 flex-shrink-0 mt-2 w-10"
                  role="img"
                  aria-label={`${task.status} indicator for task ${task.id}`}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all duration-500 ring-1 ring-transparent",
                      getStatusColor(task),
                      isActive && "ring-blue-500/50 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    )}
                  >
                    {task.status === TaskStatus.COMPLETED ? (
                      <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-black leading-none tracking-tight">
                        {task.id.slice(-2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Connector to next item */}
                  {!isLast && (
                    <div 
                      className="absolute left-1/2 top-full -translate-x-1/2 w-px h-10 bg-slate-800/30"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Task content */}
                <article 
                  className={cn(
                    "flex-1 p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 shadow-xl group-hover:shadow-2xl",
                    isActive
                      ? "border-blue-500/40 bg-gradient-to-r from-blue-500/10 to-slate-900/50 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                      : "border-slate-800/50 bg-slate-900/40 hover:border-slate-700/70 hover:bg-slate-900/60"
                  )}
                  role="group"
                  aria-labelledby={`task-title-${task.id}`}
                  aria-describedby={`task-status-${task.id}`}
                >
                  {/* Header */}
                  <header className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800/40">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-slate-500 bg-slate-900/30 px-3 py-1.5 rounded-full border border-slate-800/50">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>Phase {index + 1}</span>
                      <span className="tracking-normal px-2 bg-slate-800/50 rounded">•</span>
                      <span aria-label={`Category: ${task.category || 'General'}`}>
                        {task.category || "General"}
                      </span>
                    </div>
                    
                    <span
                      id={`task-status-${task.id}`}
                      className={cn(
                        "text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border shadow-sm inline-flex items-center gap-1",
                        task.status === TaskStatus.COMPLETED
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20"
                          : task.status === TaskStatus.IN_PROGRESS
                            ? "bg-blue-500/30 text-blue-300 border-blue-500/50 shadow-blue-500/25 animate-pulse"
                            : "bg-slate-900/50 text-slate-500 border-slate-800/50"
                      )}
                      role="status"
                      aria-live="polite"
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </header>

                  {/* Task description */}
                  <h3 
                    id={`task-title-${task.id}`}
                    className="text-lg font-bold text-slate-100 mb-4 leading-tight group-hover:text-white transition-colors line-clamp-3"
                  >
                    {task.description}
                  </h3>

                  {/* Dependencies */}
                  {task.dependencies && task.dependencies.length > 0 && (
                    <div 
                      className="mt-6 pt-4 border-t border-slate-800/30"
                      role="list"
                      aria-label={`${task.dependencies.length} dependencies`}
                    >
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        Dependencies ({task.dependencies.length})
                      </span>
                      <ul 
                        className="flex flex-wrap gap-1.5"
                        role="list"
                      >
                        {task.dependencies.slice(0, 8).map((depId) => (
                          <li key={depId}>
                            <span className="text-[11px] font-black text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/20 transition-all inline-flex items-center gap-1">
                              <span aria-hidden="true">#</span>
                              <span aria-label={`Dependency task ${depId}`}>
                                {depId}
                              </span>
                            </span>
                          </li>
                        ))}
                        {task.dependencies.length > 8 && (
                          <li>
                            <span className="text-[11px] text-slate-500 px-3 py-1 bg-slate-900/50 rounded border border-slate-800/50">
                              +{task.dependencies.length - 8} more
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default TimelineView;

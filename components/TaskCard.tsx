import React, { useRef, useEffect, useState } from "react";
import { SubTask, TaskStatus, Priority } from "../types";
import { ICONS } from "../constants";

interface TaskCardProps {
  task: SubTask;
  isActive: boolean;
  isBlocked: boolean;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isActive,
  isBlocked,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setIsExpanded(true);
    }
  }, [isActive]);

  const getStatusIcon = (status: TaskStatus) => {
    if (isBlocked && status === TaskStatus.PENDING) return ICONS.BLOCKED;
    switch (status) {
      case TaskStatus.COMPLETED:
        return ICONS.COMPLETED;
      case TaskStatus.FAILED:
        return ICONS.FAILED;
      case TaskStatus.IN_PROGRESS:
        return ICONS.IN_PROGRESS;
      case TaskStatus.WAITING:
        return ICONS.WAITING;
      default:
        return ICONS.PENDING;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    if (isBlocked && status === TaskStatus.PENDING)
      return "border-slate-800 bg-slate-900 opacity-60";
    switch (status) {
      case TaskStatus.COMPLETED:
        return "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50";
      case TaskStatus.FAILED:
        return "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50";
      case TaskStatus.IN_PROGRESS:
        return "border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
      default:
        return "border-slate-800 bg-slate-900/50 hover:border-slate-700";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      case Priority.MEDIUM:
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case Priority.LOW:
        return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    }
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-xl border transition-all duration-300 group overflow-hidden ${getStatusColor(task.status)} ${isActive ? "scale-[1.02] z-10 border-blue-400 ring-1 ring-blue-500/40 shadow-lg" : ""}`}
    >
      <div onClick={onClick} className="p-3 cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0">{getStatusIcon(task.status)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p
                className={`text-sm font-semibold leading-tight ${task.status === TaskStatus.COMPLETED ? "text-slate-500 line-through" : "text-slate-200"}`}
              >
                {task.description}
              </p>
              <span className="text-[9px] font-mono text-slate-600 ml-2 uppercase shrink-0">
                #{task.id}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span
                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
              {task.duration && (
                <span className="text-[9px] text-slate-500 font-mono">
                  🕒 {task.duration}
                </span>
              )}
              {task.parentId && (
                <span className="text-[9px] text-slate-600 font-mono">
                  Parent: #{task.parentId}
                </span>
              )}
            </div>

            {task.status === TaskStatus.IN_PROGRESS && (
              <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]"></div>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[8px] text-slate-600 uppercase tracking-widest font-black">
                {task.category || "Strategic"}
              </span>
              {(task.result || task.output) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className={`text-[9px] font-bold uppercase tracking-wider transition-all ${isExpanded ? "text-blue-400" : "text-slate-500"}`}
                >
                  {isExpanded ? "Seal" : "Declassify"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-950/50 p-3 animate-in fade-in slide-in-from-top-2">
          {task.output && (
            <div className="mb-3">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">
                Expected Output
              </span>
              <p className="text-[10px] text-slate-400 font-medium italic">
                {task.output}
              </p>
            </div>
          )}
          {task.result && (
            <div className="mb-3">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">
                Execution Log
              </span>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {task.result}
              </p>
            </div>
          )}
          {task.citations && task.citations.length > 0 && (
            <div className="pt-2 border-t border-slate-800/50">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">
                Grounding Citations
              </span>
              <div className="flex flex-wrap gap-2">
                {task.citations.map((c, i) => (
                  <a
                    key={i}
                    href={c.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-400 hover:underline truncate max-w-[150px]"
                  >
                    🔗 {c.title || c.uri}
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

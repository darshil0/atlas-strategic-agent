import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { SubTask, TaskStatus, Priority, type Citation } from "../types";
import { ICONS } from "../config";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Clock,
  Github,
  Ticket,
} from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: SubTask;
  isActive: boolean;
  isBlocked: boolean;
  onClick?: () => void;
  onDecompose?: (id: string) => void;
  onExport?: (id: string, type: "github" | "jira") => void;
  exported?: { github?: string; jira?: string };
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isActive,
  isBlocked,
  onClick,
  onDecompose,
  onExport,
  exported,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const exportButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-expand and scroll to active task
  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setIsExpanded(true);
      expandButtonRef.current?.focus();
    }
  }, [isActive]);

  const getStatusColor = (status: TaskStatus) => {
    if (isBlocked && status === TaskStatus.PENDING) {
      return "border-slate-800 bg-slate-900/60 opacity-70 cursor-not-allowed";
    }
    switch (status) {
      case TaskStatus.COMPLETED:
        return "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500/60";
      case TaskStatus.FAILED:
        return "border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60";
      case TaskStatus.IN_PROGRESS:
        return "border-blue-500/60 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.15)]";
      case TaskStatus.WAITING:
        return "border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60";
      default:
        return "border-slate-800 bg-slate-900/60 hover:border-slate-600";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "text-rose-400 border-rose-500/40 bg-rose-500/15 shadow-sm shadow-rose-500/20";
      case Priority.MEDIUM:
        return "text-amber-400 border-amber-500/40 bg-amber-500/15 shadow-sm shadow-amber-500/20";
      case Priority.LOW:
        return "text-blue-400 border-blue-500/40 bg-blue-500/15 shadow-sm shadow-blue-500/20";
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      // Could implement focus navigation between cards here
    }
  }, [onClick]);

  const handleExport = useCallback((type: "github" | "jira") => {
    onExport?.(task.id, type);
  }, [onExport, task.id]);

  return (
    <motion.article
      layout
      ref={cardRef}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      aria-labelledby={`task-title-${task.id}`}
      aria-expanded={isExpanded}
      aria-describedby={task.result || task.output ? `task-content-${task.id}` : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-2xl border transition-all duration-300 group overflow-hidden glass focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950",
        getStatusColor(task.status),
        isActive &&
        "scale-[1.02] z-20 border-blue-500/60 shadow-[0_0_40px_rgba(59,130,246,0.25)] ring-2 ring-blue-500/30",
        isBlocked && "opacity-70 cursor-not-allowed"
      )}
    >
      {/* Main card content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0 opacity-80">
            {ICONS[isBlocked ? TaskStatus.BLOCKED : task.status] || ICONS[task.status]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3
                id={`task-title-${task.id}`}
                className={cn(
                  "text-base font-semibold leading-tight pr-8",
                  task.status === TaskStatus.COMPLETED
                    ? "text-slate-500 line-through"
                    : "text-slate-200 group-hover:text-white group-focus:text-white",
                )}
              >
                {task.description}
              </h3>
              <span
                className="text-[10px] font-mono text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700 ml-2 shrink-0"
                aria-label={`Task ID: ${task.id}`}
              >
                #{task.id}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span
                className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border-2 shadow-sm",
                  getPriorityColor(task.priority),
                )}
                aria-label={`Priority: ${task.priority}`}
              >
                {task.priority.toLowerCase()}
              </span>
              {task.duration && (
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 bg-slate-900/30 px-2 py-1 rounded border border-slate-800">
                  <Clock className="w-3 h-3" /> {task.duration}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <span
                className="text-[10px] text-slate-500 uppercase tracking-widest font-black bg-slate-900/30 px-2 py-0.5 rounded"
                aria-label={`Category: ${task.category || 'Strategic'}`}
              >
                {task.category || "Strategic"}
              </span>
              <div className="flex gap-2">
                {task.status === TaskStatus.PENDING && !isBlocked && onDecompose && (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDecompose(task.id);
                    }}
                    className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-blue-400 px-3 py-1.5 bg-slate-900/50 hover:bg-blue-500/10 border border-slate-800/50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                    aria-label={`Decompose task ${task.id}`}
                  >
                    <Plus className="w-3 h-3 inline -ml-1 mr-1" />
                    Decompose
                  </button>
                )}
                {(task.result || task.output) && (
                  <button
                    ref={expandButtonRef}
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsExpanded((prev) => !prev);
                    }}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-3 py-1.5 inline-flex items-center gap-1.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950",
                      isExpanded
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                        : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-blue-300 border-slate-800/50",
                    )}
                    aria-expanded={isExpanded}
                    aria-controls={`task-content-${task.id}`}
                  >
                    {isExpanded ? (
                      <>
                        Collapse <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Expand <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.section
            id={`task-content-${task.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-slate-800/50 bg-gradient-to-b from-slate-950/70 to-slate-900/50 p-4"
          >
            {(task.output || task.result) && (
              <div className="space-y-3 mb-4">
                {task.output && (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      Expected Output
                    </h4>
                    <p className="text-[11px] text-slate-300 font-medium italic bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 leading-relaxed">
                      {task.output}
                    </p>
                  </div>
                )}
                {task.result && (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      Execution Result
                    </h4>
                    <pre className="text-[11px] text-slate-200 font-mono leading-relaxed whitespace-pre-wrap bg-slate-900/70 p-3 rounded-lg border border-slate-800/50 max-h-32 overflow-y-auto">
                      {task.result}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Export buttons */}
            {(onExport || exported) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  ref={(el) => { exportButtonsRef.current[0] = el; }}
                  onClick={() => handleExport("github")}
                  disabled={!!exported?.github}
                  className={cn(
                    "group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs font-bold h-full",
                    !!exported?.github
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 cursor-default"
                      : "bg-slate-900/50 border-slate-800/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950",
                  )}
                  aria-label={`Export to ${exported?.github ? 'GitHub (completed)' : 'GitHub'}}`}
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{exported?.github ? "✅ Exported" : "GitHub"}</span>
                </button>
                <button
                  ref={(el) => { exportButtonsRef.current[1] = el; }}
                  onClick={() => handleExport("jira")}
                  disabled={!!exported?.jira}
                  className={cn(
                    "group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs font-bold h-full",
                    !!exported?.jira
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 cursor-default"
                      : "bg-slate-900/50 border-slate-800/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950",
                  )}
                  aria-label={`Export to ${exported?.jira ? 'Jira (completed)' : 'Jira'}}`}
                >
                  <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{exported?.jira ? "✅ Exported" : "Jira"}</span>
                </button>
              </div>
            )}

            {/* Citations */}
            {task.citations && task.citations.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Grounding Citations ({task.citations.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {task.citations.slice(0, 3).map((citation: Citation, index: number) => (
                    <a
                      key={index}
                      href={citation.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-all group"
                      aria-label={`Source citation: ${citation.title || 'Untitled'}`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate max-w-[140px]">
                        {citation.title || citation.uri.split('/').pop()}
                      </span>
                    </a>
                  ))}
                  {task.citations.length > 3 && (
                    <span className="text-[10px] text-slate-500 px-2 py-1 rounded bg-slate-900/50">
                      +{task.citations.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default TaskCard;

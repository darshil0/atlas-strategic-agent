import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { SubTask, TaskStatus, Priority, type Citation } from "../types";
import { ICONS } from "../constants";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Clock,
} from "lucide-react";

/**
 * Utility for merging tailwind classes with clsx logic.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: SubTask;
  isActive: boolean;
  isBlocked: boolean;
  onClick?: () => void;
  onDecompose?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isActive,
  isBlocked,
  onClick,
  onDecompose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      setIsExpanded(true);
    }
  }, [isActive]);

  const getStatusColor = (status: TaskStatus) => {
    if (isBlocked && status === TaskStatus.PENDING) {
      return "border-slate-800 bg-slate-900 opacity-60";
    }
    switch (status) {
      case TaskStatus.COMPLETED:
        return "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50";
      case TaskStatus.FAILED:
        return "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50";
      case TaskStatus.IN_PROGRESS:
        return "border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
      case TaskStatus.WAITING:
        return "border-amber-500/30 bg-amber-500/5";
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
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border transition-all duration-300 group overflow-hidden glass",
        getStatusColor(task.status),
        isActive &&
          "scale-[1.02] z-10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20",
      )}
    >
      <div onClick={onClick} className="p-3 cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="mt-1 shrink-0">
            {ICONS[isBlocked ? "BLOCKED" : task.status]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  task.status === TaskStatus.COMPLETED
                    ? "text-slate-500 line-through"
                    : "text-slate-200",
                )}
              >
                {task.description}
              </p>
              <span className="text-[9px] font-mono text-slate-600 ml-2 uppercase shrink-0">
                #{task.id}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border",
                  getPriorityColor(task.priority),
                )}
              >
                {task.priority.toLowerCase()}
              </span>
              {task.duration && (
                <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {task.duration}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-[8px] text-slate-600 uppercase tracking-widest font-black">
                {task.category || "Strategic"}
              </span>
              <div className="flex gap-3">
                {task.status === TaskStatus.PENDING && !isBlocked && (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDecompose?.(task.id);
                    }}
                    className="text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-400 transition-all flex items-center gap-1"
                  >
                    <span>Explode</span>
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                )}
                {(task.result || task.output) && (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsExpanded((prev) => !prev);
                    }}
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1",
                      isExpanded ? "text-blue-400" : "text-slate-500",
                    )}
                  >
                    {isExpanded ? (
                      <>
                        Seal <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Declassify <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-800 bg-slate-950/50 p-3 overflow-hidden"
          >
            {task.output && (
              <div className="mb-3">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 font-display">
                  Expected Output
                </span>
                <p className="text-[10px] text-slate-400 font-medium italic">
                  {task.output}
                </p>
              </div>
            )}
            {task.result && (
              <div className="mb-3">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 font-display">
                  Execution Log
                </span>
                <p className="text-[11px] text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {task.result}
                </p>
              </div>
            )}
            {task.citations && task.citations.length > 0 && (
              <div className="pt-2 border-t border-slate-800/50">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1 font-display">
                  Grounding Citations
                </span>
                <div className="flex flex-wrap gap-2">
                  {task.citations.map((c: Citation, i: number) => (
                    <a
                      key={i}
                      href={c.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-blue-400 hover:underline truncate max-w-[150px] inline-flex items-center gap-1"
                    >
                      <LinkIcon className="w-2.5 h-2.5" />{" "}
                      {c.title || c.uri}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;

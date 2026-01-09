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
  const sortedTasks = [...plan.tasks].sort((a: SubTask, b: SubTask) =>
    a.id.localeCompare(b.id),
  );

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-6 bg-slate-950/50 rounded-2xl border border-slate-900 no-scrollbar">
      <div className="relative min-h-full">
        <div className="absolute left-[21px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-800 to-transparent"></div>

        <div className="space-y-8 relative">
          {sortedTasks.map((task: SubTask, index: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex gap-6 items-start transition-all duration-500",
                activeTaskId === task.id && "translate-x-2",
              )}
            >
              <div className="relative z-10 mt-1">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-500",
                    task.status === TaskStatus.COMPLETED
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : task.status === TaskStatus.IN_PROGRESS
                        ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse"
                        : "bg-slate-900 border-slate-800 text-slate-600 grayscale",
                  )}
                >
                  {task.status === TaskStatus.COMPLETED ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-[10px] font-black">{task.id}</span>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "flex-1 p-5 rounded-[1.5rem] border transition-all duration-500 glass",
                  activeTaskId === task.id
                    ? "border-blue-500/50 bg-blue-500/5 shadow-2xl"
                    : "border-slate-800/60 bg-slate-900/20",
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Phase {index + 1} •{" "}
                    {task.category || "General"}
                  </span>
                  <div
                    className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                      task.status === TaskStatus.COMPLETED
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    )}
                  >
                    {task.status.replace("-", " ")}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-1 leading-tight flex items-center gap-2">
                  {task.description}
                </h4>
                {task.dependencies && task.dependencies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800/40">
                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                      <ArrowRight className="w-2.5 h-2.5" /> Blocked By:
                    </span>
                    {task.dependencies.map((dep: string) => (
                      <span
                        key={dep}
                        className="text-[8px] font-black text-blue-400 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10"
                      >
                        #{dep}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;

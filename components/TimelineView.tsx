// src/components/TimelineView.tsx
import { motion } from "framer-motion";
import { Calendar, Clock, Target } from "lucide-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import type { Plan, SubTask } from "../types/plan.types";

interface TimelineViewProps {
  plan: Plan;
  className?: string;
}

export default function TimelineView({ plan, className }: TimelineViewProps) {
  const timelineItems = useMemo(() => {
    const items: Array<{
      title: string;
      start: string;
      end: string;
      status: "not-started" | "in-progress" | "completed";
      subtasks: SubTask[];
    }> = [];

    plan.phases.forEach((phase) => {
      phase.milestones.forEach((milestone) => {
        items.push({
          title: milestone.name,
          start: milestone.startDate,
          end: milestone.endDate,
          status: milestone.status,
          subtasks: milestone.subtasks,
        });
      });
    });

    return items;
  }, [plan]);

  return (
    <div className={twMerge("w-full space-y-6", className)}>
      {/* Timeline Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-1 backdrop-blur-3xl rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-6 w-6 text-atlas-blue" />
          <h2 className="text-2xl font-display font-semibold text-white">
            Strategic Timeline
          </h2>
        </div>
        <p className="text-slate-300 text-sm">
          {timelineItems.length} milestones across {plan.phases.length} phases
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-atlas-indigo/30 to-atlas-blue/30 rounded-full" />

        {timelineItems.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-8 flex items-start relative"
          >
            {/* Timeline Dot */}
            <div className={clsx(
              "absolute left-7 w-4 h-4 rounded-full z-10 ring-8 ring-white/10",
              {
                "bg-green-500": item.status === "completed",
                "bg-yellow-500": item.status === "in-progress",
                "bg-slate-500": item.status === "not-started",
              }
            )} />

            {/* Timeline Content */}
            <div className="ml-16 flex-1">
              <div className={clsx(
                "glass-1 backdrop-blur-3xl rounded-2xl p-6 border border-white/10 mb-4",
                "hover:border-white/20 transition-all duration-300"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold text-white text-xl">
                    {item.title}
                  </h3>
                  <div className={clsx(
                    "px-3 py-1 rounded-full text-xs font-mono font-medium",
                    {
                      "bg-green-500/20 text-green-400 border border-green-500/30": item.status === "completed",
                      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30": item.status === "in-progress",
                      "bg-slate-500/20 text-slate-400 border border-slate-500/30": item.status === "not-started",
                    }
                  )}>
                    {item.status.replace("-", " ").toUpperCase()}
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.start).toLocaleDateString()}</span>
                  </div>
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{new Date(item.end).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {item.subtasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Progress</span>
                      <span>
                        {Math.round(
                          (item.subtasks.filter((task) => task.completed).length / item.subtasks.length) * 100
                        )}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-atlas-blue to-atlas-indigo h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.subtasks.filter((task) => task.completed).length / item.subtasks.length) * 100}%`,
                        }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subtasks Preview */}
              {item.subtasks.slice(0, 3).map((subtask, subIndex) => (
                <motion.div
                  key={subtask.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-2 backdrop-blur-xl p-4 rounded-xl border border-white/5 ml-4 -mt-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-2 h-2 rounded-full",
                      {
                        "bg-green-400": subtask.completed,
                        "bg-slate-400": !subtask.completed,
                      }
                    )} />
                    <span className="text-sm text-white font-medium truncate flex-1">
                      {subtask.title}
                    </span>
                    <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

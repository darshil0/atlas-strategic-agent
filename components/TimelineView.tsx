import React from "react";
import { Plan, SubTask, TaskStatus } from "../types";

interface TimelineViewProps {
    plan: Plan;
    activeTaskId: string | null;
}

const TimelineView: React.FC<TimelineViewProps> = ({ plan, activeTaskId }) => {
    const sortedTasks = [...plan.tasks].sort((a: SubTask, b: SubTask) => {
        return a.id.localeCompare(b.id);
    });

    return (
        <div className="h-full overflow-y-auto overflow-x-hidden p-4 bg-slate-950 rounded-2xl border border-slate-800 scrollbar-hide">
            <div className="relative min-h-full">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800"></div>

                <div className="space-y-6 relative">
                    {sortedTasks.map((task: SubTask, index: number) => (
                        <div
                            key={task.id}
                            className={`flex gap-6 items-start transition-all duration-500 ${activeTaskId === task.id ? "scale-[1.02] translate-x-2" : ""
                                }`}
                        >
                            <div className="relative z-10 mt-2">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${task.status === TaskStatus.COMPLETED
                                            ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                            : task.status === TaskStatus.IN_PROGRESS
                                                ? "bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse"
                                                : "bg-slate-900 border-slate-800 grayscale"
                                        }`}
                                >
                                    <span className="text-[10px] font-black">{task.id}</span>
                                </div>
                            </div>

                            <div
                                className={`flex-1 p-5 rounded-3xl border transition-all duration-500 glass ${activeTaskId === task.id
                                        ? "border-blue-500 bg-blue-500/5 shadow-2xl"
                                        : "border-slate-800 bg-slate-900/30"
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                                        Phase {index + 1} • {task.category || "General"}
                                    </span>
                                    <span
                                        className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${task.status === TaskStatus.COMPLETED
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-blue-500/20 text-blue-400"
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-100 mb-1 leading-tight">
                                    {task.description}
                                </h4>
                                {task.dependencies && task.dependencies.length > 0 && (
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800/50">
                                        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">
                                            Requires:
                                        </span>
                                        {task.dependencies.map((dep: string) => (
                                            <span
                                                key={dep}
                                                className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-1.5 rounded"
                                            >
                                                #{dep}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;

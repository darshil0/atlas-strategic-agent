import React, { useState, useMemo, useCallback } from "react";
import { TASK_BANK, BankTask } from "../data/taskBank";
import { Priority } from "../types";

interface TaskBankProps {
  onAddTask: (task: BankTask) => void;
  onClose: () => void;
}

const THEME_COLORS: Record<string, string> = {
  AI: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Global: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Infra: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  ESG: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  People: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Cyber: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.HIGH]: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  [Priority.MEDIUM]: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  [Priority.LOW]: "text-blue-400 border-blue-500/30 bg-blue-500/10",
};

const TaskBank = ({ onAddTask, onClose }: TaskBankProps) => {
  const [search, setSearch] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  const filteredTasks = useMemo(() => {
    if (!TASK_BANK?.length) return [];
    const query = search.trim().toLowerCase();

    return TASK_BANK.filter((task: BankTask) => {
      const matchesSearch =
        !query ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query);
      const matchesTheme = selectedTheme ? task.theme === selectedTheme : true;
      const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
      return matchesSearch && matchesTheme && matchesPriority;
    }).sort((a: BankTask, b: BankTask) => a.id.localeCompare(b.id));
  }, [search, selectedTheme, selectedPriority]);

  const themes = Object.keys(THEME_COLORS);
  const priorities = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];

  return (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300 shadow-2xl z-50">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div>
          <h2 className="font-bold text-slate-100 tracking-tight">Strategic Task Bank</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "Objective" : "Objectives"} Available
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-slate-100 transition-colors hover:bg-slate-800 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4 border-b border-slate-800/50">
        <div className="relative group">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Objective..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTheme(null)}
              className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${!selectedTheme ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 text-slate-500"
                }`}
            >
              All
            </button>
            {themes.map((t: string) => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${selectedTheme === t ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-800/50 text-slate-500"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredTasks.map((task: BankTask) => (
          <div
            key={task.id}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-blue-500/30 transition-all group relative"
          >
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${THEME_COLORS[task.theme] || ""}`}>
                  {task.theme}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${PRIORITY_COLORS[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-600">#{task.id}</span>
            </div>
            <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4">{task.description}</p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
              <span className="text-[10px] text-slate-500 font-bold uppercase">{task.category}</span>
              <button
                onClick={() => onAddTask(task)}
                className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg active:scale-95 transition-all"
              >
                Import
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBank;

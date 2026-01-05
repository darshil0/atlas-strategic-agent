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

const TaskBank: React.FC<TaskBankProps> = ({ onAddTask, onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  // Ensure stable callbacks (prevents unnecessary re‑renders)
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  const filteredTasks = useMemo(() => {
    if (!TASK_BANK?.length) return [];
    const query = search.trim().toLowerCase();

    return TASK_BANK.filter((task) => {
      const matchesSearch =
        !query ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query);
      const matchesTheme = selectedTheme ? task.theme === selectedTheme : true;
      const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
      return matchesSearch && matchesTheme && matchesPriority;
    }).sort((a, b) => a.id.localeCompare(b.id));
  }, [search, selectedTheme, selectedPriority]);

  const themes = Object.keys(THEME_COLORS);
  const priorities = [Priority.HIGH, Priority.MEDIUM, Priority.LOW];

  return (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300 shadow-2xl z-50">
      {/* Header */}
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
          aria-label="Close Task Bank"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-4 border-b border-slate-800/50">
        <div className="relative group">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Objective or Category..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all group-hover:border-slate-700"
          />
          <div className="absolute right-3 top-3 text-slate-600 group-hover:text-blue-500 transition-colors">
            {search ? (
              <button onClick={() => setSearch("")} className="hover:text-white" aria-label="Clear search">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* Theme Filter */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-black text-slate-600 tracking-widest ml-1">
              Themes
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTheme(null)}
                className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${
                  !selectedTheme
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${
                    selectedTheme === t
                      ? "bg-slate-700 border-slate-600 text-white shadow-md"
                      : "bg-slate-800/50 border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-black text-slate-600 tracking-widest ml-1">
              Strategic Priority
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedPriority(null)}
                className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${
                  !selectedPriority
                    ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${
                    selectedPriority === p
                      ? "bg-slate-700 border-slate-600 text-white shadow-md"
                      : "bg-slate-800/50 border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-400">No matching objectives</p>
            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">
              Refine your search parameters
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.1em] border ${
                      THEME_COLORS[task.theme] || "text-slate-400 border-slate-700 bg-slate-800"
                    }`}
                  >
                    {task.theme}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.1em] border ${PRIORITY_COLORS[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 group-hover:text-blue-400 transition-colors">
                  #{task.id}
                </span>
              </div>

              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4 group-hover:text-white transition-colors">
                {task.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight group-hover:text-slate-300 transition-colors">
                    {task.category}
                  </span>
                </div>
                <button
                  onClick={() => onAddTask(task)}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all active:scale-95 border border-blue-500/20 hover:border-blue-500 shadow-sm"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Import
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 backdrop-blur-sm">
        <div className="flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          <span>Global Library v1.5</span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            Priority Sync Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskBank;

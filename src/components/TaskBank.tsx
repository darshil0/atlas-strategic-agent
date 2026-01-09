import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TASK_BANK, type BankTask } from "../data/taskBank";
import { Priority } from "../types";
import { Search, X, Filter, Layers, Zap, Import } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

  const filteredTasks = useMemo(() => {
    if (!TASK_BANK?.length) return [];
    const query = search.trim().toLowerCase();

    return TASK_BANK.filter((task: BankTask) => {
      const matchesSearch =
        !query ||
        task.description.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query);
      const matchesTheme = selectedTheme ? task.theme === selectedTheme : true;
      return matchesSearch && matchesTheme;
    }).sort((a: BankTask, b: BankTask) => a.id.localeCompare(b.id));
  }, [search, selectedTheme]);

  const themes = useMemo(() => Object.keys(THEME_COLORS), []);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-3xl border-l border-slate-800 shadow-3xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div>
          <h2 className="font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" /> Strategic Task Bank
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
            {filteredTasks.length} Objectives Available
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6 border-b border-slate-800/50">
        <div className="relative group">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Objective..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">
            <Filter className="w-3 h-3" /> Themes
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTheme(null)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all",
                !selectedTheme
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300",
              )}
            >
              All
            </button>
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all",
                  selectedTheme === t
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-slate-800/40 border-slate-800 text-slate-500 hover:text-slate-300",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-blue-500/30 transition-all group relative"
            >
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-black border",
                      THEME_COLORS[task.theme] || "",
                    )}
                  >
                    {task.theme}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-black border",
                      PRIORITY_COLORS[task.priority],
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-700">
                  #{task.id}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4 group-hover:text-white transition-colors">
                {task.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                <span className="text-[10px] text-slate-600 font-bold uppercase flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> {task.category}
                </span>
                <button
                  onClick={() => onAddTask(task)}
                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[10px] font-black uppercase rounded-lg active:scale-95 transition-all flex items-center gap-1.5 border border-blue-500/20"
                >
                  <Import className="w-3 h-3" /> Import
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskBank;

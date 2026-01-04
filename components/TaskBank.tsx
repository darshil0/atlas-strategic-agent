
import React, { useState, useMemo } from 'react';
import { TASK_BANK, BankTask } from '../data/taskBank';

interface TaskBankProps {
  onAddTask: (task: BankTask) => void;
  onClose: () => void;
}

const THEME_COLORS: Record<string, string> = {
  AI: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Global: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Infra: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  ESG: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  People: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Cyber: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const TaskBank: React.FC<TaskBankProps> = ({ onAddTask, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return TASK_BANK
      .filter(task => {
        const matchesSearch = task.description.toLowerCase().includes(search.toLowerCase()) || 
                             task.category.toLowerCase().includes(search.toLowerCase()) ||
                             task.id.toLowerCase().includes(search.toLowerCase());
        const matchesTheme = selectedTheme ? task.theme === selectedTheme : true;
        return matchesSearch && matchesTheme;
      })
      .sort((a, b) => a.id.localeCompare(b.id)); // Ensure strict ascending order by ID
  }, [search, selectedTheme]);

  const themes = ['AI', 'Global', 'Infra', 'ESG', 'People', 'Cyber'];

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div>
          <h2 className="font-bold text-slate-100 font-sans tracking-tight">Strategic Task Bank</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">100 Future-Forward Tasks</p>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-100 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative">
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, Goal, or Category..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none placeholder-slate-600"
          />
          <div className="absolute right-3 top-2.5 text-slate-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => setSelectedTheme(null)}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${!selectedTheme ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
          >
            All
          </button>
          {themes.map(theme => (
            <button 
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-2 py-1 rounded text-[9px] font-bold uppercase border transition-all ${selectedTheme === theme ? 'bg-slate-700 border-slate-600 text-white shadow-sm' : 'bg-slate-800/50 border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <p className="text-sm italic">No matching objectives found.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className="p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${THEME_COLORS[task.theme]}`}>
                  {task.theme}
                </span>
                <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">#{task.id}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-3 group-hover:text-white transition-colors">
                {task.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{task.category}</span>
                <button 
                  onClick={() => onAddTask(task)}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold rounded flex items-center gap-1 transition-all active:scale-95 shadow-lg shadow-blue-500/10"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Import
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBank;

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Message, Plan, TaskStatus, AgentMode, SubTask, Priority } from './types';
import { AtlasService } from './services/geminiService';
import TaskCard from './components/TaskCard';
import DependencyGraph from './components/DependencyGraph';
import TaskBank from './components/TaskBank';
import { BankTask } from './data/taskBank';

const ROADMAP_2025_2026: Plan = {
  goal: "Comprehensive 2025-2026 Strategic Evolution Roadmap",
  tasks: [
    { id: "1", description: "Establish 2025 Q1 Infrastructure Foundation", status: TaskStatus.PENDING, priority: Priority.HIGH, category: "2025 Q1" },
    { id: "2", description: "Launch Alpha Beta User Program", status: TaskStatus.PENDING, priority: Priority.MEDIUM, category: "2025 Q1", dependencies: ["1"] },
    { id: "3", description: "Scale Core Architecture for High Availability", status: TaskStatus.PENDING, priority: Priority.HIGH, category: "2025 Q2", dependencies: ["1"] },
    { id: "4", description: "Mid-Year Performance Audit & Optimization", status: TaskStatus.PENDING, priority: Priority.MEDIUM, category: "2025 Q2", dependencies: ["3"] },
    { id: "5", description: "International Market Entry Analysis", status: TaskStatus.PENDING, priority: Priority.MEDIUM, category: "2025 Q3" },
    { id: "6", description: "European Hub Deployment", status: TaskStatus.PENDING, priority: Priority.HIGH, category: "2025 Q3", dependencies: ["5", "3"] },
    { id: "7", description: "FY2025 Strategic Review & Board Alignment", status: TaskStatus.PENDING, priority: Priority.HIGH, category: "2025 Q4", dependencies: ["4", "6"] },
    { id: "8", description: "Deployment of NextGen Multi-Modal Agent Orchestrator", status: TaskStatus.PENDING, priority: Priority.HIGH, category: "2026 Q1", dependencies: ["7"] },
    { id: "9", description: "Establishment of APAC Strategic Operations Hub", status: TaskStatus.PENDING, priority: Priority.MEDIUM, category: "2026 Q2", dependencies: ["8"] },
    { id: "10", description: "Achieving Level 5 Autonomous Strategic Synthesis", status: TaskStatus.PENDING, priority: Priority.HIGH, category: "2026 Vision", dependencies: ["9"] }
  ]
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [mode, setMode] = useState<AgentMode>(AgentMode.AUTONOMOUS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<'list' | 'graph'>('list');
  const [isTaskBankOpen, setIsTaskBankOpen] = useState(false);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages(prev => [...prev, { id, role, content, timestamp: Date.now() }]);
    return id;
  };

  const updateAssistantMessage = (id: string, newChunk: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, content: m.content + newChunk } : m
    ));
  };

  const isTaskBlocked = useCallback((task: SubTask, allTasks: SubTask[]) => {
    if (!task.dependencies || task.dependencies.length === 0) return false;
    return task.dependencies.some(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.status !== TaskStatus.COMPLETED;
    });
  }, []);

  const handleTaskSelect = (id: string) => {
    setActiveTaskId(id);
    setSidebarView('list');
    setTimeout(() => {
      taskRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleAddTask = () => {
    if (!newTaskDesc.trim()) return;
    setCurrentPlan(prev => {
      if (!prev) return null;
      const nextId = (Math.max(0, ...prev.tasks.map(t => parseInt(t.id) || 0)) + 1).toString();
      const newTask: SubTask = {
        id: nextId,
        description: newTaskDesc.trim(),
        category: newTaskCategory.trim() || undefined,
        priority: newTaskPriority,
        status: TaskStatus.PENDING,
        dependencies: []
      };
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });
    setNewTaskDesc('');
    setNewTaskCategory('');
    setNewTaskPriority(Priority.MEDIUM);
    setIsAddingTask(false);
  };

  const handleImportFromBank = (bankTask: BankTask) => {
    setCurrentPlan(prev => {
      if (!prev) return null;
      const nextId = (Math.max(0, ...prev.tasks.map(t => parseInt(t.id) || 0)) + 1).toString();
      const newTask: SubTask = {
        id: nextId,
        description: bankTask.description,
        category: bankTask.category,
        priority: bankTask.priority,
        status: TaskStatus.PENDING,
        dependencies: []
      };
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });
    addMessage('assistant', `✓ Objective Synchronized: Added "${bankTask.description}" to mission.`);
  };

  const executePlan = async (plan: Plan) => {
    setCurrentPlan(plan);
    let history = "";
    let latestTasks = [...plan.tasks];

    const getNextTask = () => latestTasks.find(t => 
      t.status === TaskStatus.PENDING && !isTaskBlocked(t, latestTasks)
    );

    while (latestTasks.some(t => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.FAILED)) {
      const nextTask = getNextTask();

      if (!nextTask) {
        if (latestTasks.every(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.FAILED)) break;
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      setActiveTaskId(nextTask.id);
      
      setCurrentPlan(prev => {
        if (!prev) return null;
        const updated = prev.tasks.map(t => t.id === nextTask.id ? { ...t, status: TaskStatus.IN_PROGRESS, result: '' } : t);
        latestTasks = updated;
        return { ...prev, tasks: updated };
      });

      const assistantMsgId = addMessage('assistant', `→ Operation: Executing #${nextTask.id}...\n\n`);
      
      try {
        const result = await AtlasService.executeSubtask(
          nextTask.description, 
          `Original Goal: ${plan.goal}\nHistory: ${history}`,
          (chunk) => {
            updateAssistantMessage(assistantMsgId, chunk);
            setCurrentPlan(prev => {
              if (!prev) return null;
              return {
                ...prev,
                tasks: prev.tasks.map(t => t.id === nextTask.id ? { ...t, result: (t.result || '') + chunk } : t)
              };
            });
          }
        );
        
        history += `\nTask ${nextTask.id}: ${result.text}\n`;
        
        setCurrentPlan(prev => {
          if (!prev) return null;
          const updated = prev.tasks.map(t => t.id === nextTask.id ? { 
            ...t, 
            status: TaskStatus.COMPLETED, 
            result: result.text,
            citations: result.citations 
          } : t);
          latestTasks = updated;
          return { ...prev, tasks: updated };
        });
      } catch (error) {
        setCurrentPlan(prev => {
          if (!prev) return null;
          const updated = prev.tasks.map(t => t.id === nextTask.id ? { ...t, status: TaskStatus.FAILED } : t);
          latestTasks = updated;
          return { ...prev, tasks: updated };
        });
        addMessage('assistant', `⚠ Operation Alert: Core failure on Task ${nextTask.id}. Manual retry required.`);
        break;
      }
    }

    setActiveTaskId(null);
    const summary = await AtlasService.summarizeMission(plan, history);
    addMessage('assistant', `✓ Mission Concluded\n\n${summary}`);
  };

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || isThinking) return;
    setInput('');
    addMessage('user', text);
    setIsThinking(true);
    try {
      const plan = await AtlasService.generatePlan(text);
      if (plan && plan.tasks.length > 0) {
        addMessage('assistant', `Atlas Strategic engaged: "${plan.goal}". ${plan.tasks.length} operations identified.`);
        setCurrentPlan(plan);
        if (mode === AgentMode.AUTONOMOUS) await executePlan(plan);
      }
    } catch (error) {
      addMessage('assistant', "I encountered a neural synchronization error.");
    } finally {
      setIsThinking(false);
    }
  };

  const groupedTasks = useMemo(() => {
    if (!currentPlan) return {};
    return currentPlan.tasks.reduce((acc, task) => {
      const cat = task.category || "General Operations";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(task);
      return acc;
    }, {} as Record<string, SubTask[]>);
  }, [currentPlan]);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200 selection:bg-blue-600/30">
      <aside className={`
        ${isSidebarOpen ? (isTaskBankOpen ? 'w-[640px]' : 'w-80') : 'w-0'} 
        transition-all duration-300 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex relative z-20
      `}>
        <div className="w-80 flex flex-col flex-shrink-0 border-r border-slate-800/50">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-blue-600/20">A</div>
              <h2 className="font-bold text-slate-100 tracking-tight">Atlas Command</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-slate-200 p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
          </div>

          {currentPlan && (
            <div className="px-4 py-2 border-b border-slate-800 flex bg-slate-900/40">
              <button 
                onClick={() => setSidebarView('list')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${sidebarView === 'list' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500'}`}
              >
                List View
              </button>
              <button 
                onClick={() => setSidebarView('graph')}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${sidebarView === 'graph' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500'}`}
              >
                Graph View
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar scroll-smooth">
            {!currentPlan ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 animate-pulse">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Awaiting Signal</p>
                  <button 
                    onClick={() => executePlan(JSON.parse(JSON.stringify(ROADMAP_2025_2026)))}
                    className="w-full px-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] font-black rounded-xl border border-blue-500/20 transition-all uppercase tracking-[0.2em] active:scale-95 shadow-xl"
                  >
                    Load Strategic 2025 Roadmap
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600">Primary Objective</p>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setIsTaskBankOpen(!isTaskBankOpen)}
                        className={`p-1.5 rounded-lg transition-all ${isTaskBankOpen ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-blue-400 hover:bg-slate-800 border border-transparent'}`}
                        title="Library"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setIsAddingTask(!isAddingTask)}
                        className={`p-1.5 rounded-lg transition-all ${isAddingTask ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-blue-400 hover:bg-slate-800 border border-transparent'}`}
                        title="Inject Operation"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-100 font-bold leading-tight bg-slate-900/50 p-3 rounded-xl border border-slate-800">{currentPlan.goal}</p>
                </div>

                {sidebarView === 'list' ? (
                  <div className="space-y-6 pb-20">
                    {isAddingTask && (
                      <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-500/5 animate-in fade-in slide-in-from-top-3 duration-500">
                        <p className="text-[9px] uppercase font-black text-blue-400 mb-3 tracking-widest">Operation Injection</p>
                        <input 
                          autoFocus
                          type="text"
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Operational directive..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-700 mb-3 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                        <div className="flex gap-2 mb-3">
                           <input 
                            type="text"
                            value={newTaskCategory}
                            onChange={(e) => setNewTaskCategory(e.target.value)}
                            placeholder="Phase"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-slate-100 placeholder-slate-700 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                          <select 
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none"
                          >
                            <option value={Priority.HIGH}>High</option>
                            <option value={Priority.MEDIUM}>Med</option>
                            <option value={Priority.LOW}>Low</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleAddTask} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2 rounded-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95">Initiate</button>
                          <button onClick={() => setIsAddingTask(false)} className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black py-2 rounded-lg transition-all">Abort</button>
                        </div>
                      </div>
                    )}

                    {Object.entries(groupedTasks).map(([cat, tasks]) => (
                      <div key={cat} className="space-y-3">
                        <div className="flex items-center gap-3 px-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-600 whitespace-nowrap">{cat}</p>
                          <div className="h-[1px] flex-1 bg-slate-800/50"></div>
                        </div>
                        <div className="space-y-3">
                          {tasks.map((task) => (
                            <div key={task.id} ref={(el) => { taskRefs.current[task.id] = el; }}>
                              <TaskCard 
                                task={task} 
                                isActive={activeTaskId === task.id} 
                                isBlocked={isTaskBlocked(task, currentPlan.tasks)}
                                onClick={() => handleTaskSelect(task.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[650px] flex flex-col">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-4 px-1">Neural Dependency Grid</p>
                    <DependencyGraph 
                      tasks={currentPlan.tasks} 
                      activeTaskId={activeTaskId} 
                      onTaskSelect={handleTaskSelect}
                      isTaskBlocked={isTaskBlocked} 
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-5 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Atlas v2.5 Strategic</span>
              </div>
              {currentPlan && (
                <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                  {Math.round((currentPlan.tasks.filter(t => t.status === TaskStatus.COMPLETED).length / currentPlan.tasks.length) * 100)}% Synchronized
                </div>
              )}
            </div>
          </div>
        </div>

        {isTaskBankOpen && (
          <div className="w-80 flex-shrink-0">
            <TaskBank 
              onAddTask={handleImportFromBank} 
              onClose={() => setIsTaskBankOpen(false)} 
            />
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative z-10">
        <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-6">
             {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-slate-100 p-2 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            )}
            <h1 className="text-xl font-black text-slate-100 tracking-tighter uppercase italic">Atlas <span className="text-blue-600 non-italic">Strategic</span></h1>
          </div>
          <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800/50">
            {Object.values(AgentMode).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${mode === m ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}>
                {m}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-blue-600/5 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-600/10 rotate-6 animate-pulse">
                <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">Autonomous Strategic <span className="text-blue-600">Synthesis</span></h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl mx-auto">Convert complex long-term ambitions into manageable execution paths with visual dependency logic.</p>
              </div>
              <div className="grid grid-cols-2 gap-6 w-full pt-8">
                {[
                  "Architect a 5-year GTM strategy for Neural Computing", 
                  "Synthesize an autonomous supply chain protocol for 2030"
                ].map((hint) => (
                  <button key={hint} onClick={() => setInput(hint)} className="p-6 text-left border border-slate-900 bg-slate-900/20 rounded-2xl hover:border-blue-600/40 hover:bg-slate-900/40 transition-all text-sm font-bold text-slate-500 hover:text-white group relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
              <div className={`max-w-[85%] rounded-[2rem] p-8 ${m.role === 'user' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' : 'bg-slate-900/80 border border-slate-800 text-slate-100 backdrop-blur-xl'}`}>
                <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                  {m.role === 'user' ? (
                    <><div className="w-1.5 h-1.5 rounded-full bg-white"></div> User Strategic Directive</>
                  ) : (
                    <><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Atlas Analytical Core</>
                  )}
                </div>
                <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap leading-relaxed font-semibold text-base">{m.content}</div>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-900/40 border border-slate-800/40 rounded-2xl px-6 py-4 flex items-center gap-5 backdrop-blur-xl">
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Synthesizing Critical Path...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <div className="max-w-5xl mx-auto relative group">
            <div className="relative flex items-center bg-slate-900/60 backdrop-blur-[2rem] border border-slate-800 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-slate-800/50 hover:ring-blue-600/40 transition-all duration-700">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Declare high-level mission objective..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-700 py-4 px-8 resize-none h-16 text-lg font-bold no-scrollbar"
              />
              <button 
                onClick={() => handleSend()} 
                disabled={isThinking || !input.trim()} 
                className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] transition-all text-white bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-600/20 disabled:bg-slate-800 disabled:text-slate-700 active:scale-90"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default App;
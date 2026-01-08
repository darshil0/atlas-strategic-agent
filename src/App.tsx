<<<<<<< HEAD
﻿import React, {
=======
import React, {
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import {
  Message,
  Plan,
  TaskStatus,
  AgentMode,
  SubTask,
} from "./types";
import { AtlasService } from "./services/geminiService";
import { PersistenceService } from "./services/persistenceService";
import TaskCard from "./components/TaskCard";
import DependencyGraph from "./components/DependencyGraph";
import TaskBank from "./components/TaskBank";
import { BankTask } from "./data/taskBank";
import { A2UIRenderer } from "./components/a2ui/A2UIRenderer";
import { AGUIEvent, A2UIMessage } from "./lib/adk/protocol";
import { PlanExporter } from "./lib/adk/exporter";
import { MissionControl } from "./lib/adk/orchestrator";
import TimelineView from "./components/TimelineView";
import {
  Zap,
  Settings,
  Database,
<<<<<<< HEAD
=======
  Share2,
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  ChevronRight,
  Send,
  Activity,
  ShieldCheck,
<<<<<<< HEAD
  CloudLightning,
=======
  CloudZap,
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  Terminal,
  FileJson
} from "lucide-react";

/**
 * Utility for merging tailwind classes with clsx logic.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const missionControl = new MissionControl();

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [mode, setMode] = useState<AgentMode>(AgentMode.AUTONOMOUS);
  const [isWhatIfEnabled, setIsWhatIfEnabled] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{ cascade: string[], riskScore: number } | null>(null);
  const [sidebarView, setSidebarView] = useState<"list" | "graph" | "timeline">("list");
  const [isTaskBankOpen, setIsTaskBankOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    const savedMessages = PersistenceService.getMessages();
    const savedPlan = PersistenceService.getPlan();
    if (savedMessages.length > 0) setMessages(savedMessages);
    if (savedPlan) setCurrentPlan(savedPlan);
  }, []);

  useEffect(() => {
    PersistenceService.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    PersistenceService.savePlan(currentPlan);
  }, [currentPlan]);

  const addMessage = (role: Message["role"], content: string, a2ui?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages((prev: Message[]) => [
      ...prev,
      { id, role, content, timestamp: Date.now(), a2ui },
    ]);
    return id;
  };

  const isTaskBlocked = useCallback((task: SubTask, allTasks: SubTask[]) => {
    if (!task.dependencies || task.dependencies.length === 0) return false;
    return task.dependencies.some((depId: string) => {
      const depTask = allTasks.find((t: SubTask) => t.id === depId);
      return depTask && depTask.status !== TaskStatus.COMPLETED;
    });
  }, []);

  const handleTaskSelect = (id: string) => {
    setActiveTaskId(id);
    setSidebarView("list");
    setTimeout(
      () =>
        taskRefs.current[id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      50,
    );
  };

  const executePlan = async (plan: Plan) => {
    setCurrentPlan(plan);
    let history = "";
<<<<<<< HEAD
    const latestTasks = [...plan.tasks];
=======
    let latestTasks = [...plan.tasks];
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44

    const getNextTask = () =>
      latestTasks.find(
        (t: SubTask) =>
          t.status === TaskStatus.PENDING && !isTaskBlocked(t, latestTasks),
      );

    while (
      latestTasks.some(
        (t: SubTask) =>
          t.status === TaskStatus.PENDING ||
          t.status === TaskStatus.IN_PROGRESS,
      )
    ) {
      const nextTask = getNextTask();
      if (!nextTask) {
        if (
          latestTasks.every(
            (t: SubTask) =>
              t.status === TaskStatus.COMPLETED ||
              t.status === TaskStatus.FAILED,
          )
        ) {
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      setActiveTaskId(nextTask.id);
      nextTask.status = TaskStatus.IN_PROGRESS;
      setCurrentPlan({ ...plan, tasks: [...latestTasks] });

      try {
        const response = await AtlasService.executeSubtask(
          nextTask,
          plan,
          history,
        );
        history += `\nTask ${nextTask.id} output: ${response.text}`;
        nextTask.status = TaskStatus.COMPLETED;
        setCurrentPlan({ ...plan, tasks: [...latestTasks] });
        addMessage("assistant", response.text, response.a2ui);
      } catch {
        nextTask.status = TaskStatus.FAILED;
        setCurrentPlan({ ...plan, tasks: [...latestTasks] });
        addMessage(
          "assistant",
<<<<<<< HEAD
          `âš  Operation Alert: Core failure on Task ${nextTask.id}. Manual retry or replan required.`,
=======
          `⚠ Operation Alert: Core failure on Task ${nextTask.id}. Manual retry or replan required.`,
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
        );
        break;
      }
    }

    setActiveTaskId(null);
    const summary = await AtlasService.summarizeMission(plan, history);
<<<<<<< HEAD
    addMessage("assistant", `âœ“ Mission Concluded\n\n${summary}`);
=======
    addMessage("assistant", `✓ Mission Concluded\n\n${summary}`);
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  };

  const handleA2UIEvent = (event: AGUIEvent) => {
    addMessage("user", `Executed action: ${event.action} on ${event.elementId}`);
    if (event.action.startsWith("GITHUB_")) {
<<<<<<< HEAD
      addMessage("assistant", `ðŸš€ [EXTERNAL] Syncing with GitHub... Action: ${event.action}. Status: Success.`);
    } else if (event.action.startsWith("SLACK_")) {
      addMessage("assistant", `ðŸ’¬ [EXTERNAL] Dispatching Slack notification... Status: Delivered.`);
=======
      addMessage("assistant", `🚀 [EXTERNAL] Syncing with GitHub... Action: ${event.action}. Status: Success.`);
    } else if (event.action.startsWith("SLACK_")) {
      addMessage("assistant", `💬 [EXTERNAL] Dispatching Slack notification... Status: Delivered.`);
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
    }
  };

  const handleConnect = (source: string, target: string) => {
    setCurrentPlan((prev: Plan | null) => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map((t: SubTask) =>
          t.id === target
            ? { ...t, dependencies: [...new Set([...(t.dependencies || []), source])] }
            : t,
        ),
      };
    });
<<<<<<< HEAD
    addMessage("assistant", `âœ“ **Strategic Link Established:** Task #${source} now precedes #${target}.`);
=======
    addMessage("assistant", `✓ **Strategic Link Established:** Task #${source} now precedes #${target}.`);
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  };

  const handleFailureSimulation = async (taskId: string) => {
    if (!currentPlan) return;
    const result = await missionControl.simulateFailure(currentPlan, taskId);
    setSimulationResult(result);
<<<<<<< HEAD
    addMessage("assistant", `âš ï¸ STRATEGIC RISK ALERT: Failure in #${taskId} would cause a cascade effect across ${result.cascade.length} nodes, resulting in a ${result.riskScore.toFixed(1)}% mission compromise.`);
=======
    addMessage("assistant", `⚠️ STRATEGIC RISK ALERT: Failure in #${taskId} would cause a cascade effect across ${result.cascade.length} nodes, resulting in a ${result.riskScore.toFixed(1)}% mission compromise.`);
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
  };

  const handleDecompose = (taskId: string) => {
    const task = currentPlan?.tasks.find((t: SubTask) => t.id === taskId);
    if (!task) return;
    handleSend(`Explode task #${taskId}: ${task.description}. Break this down into 3-5 subtasks.`);
  };

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || isThinking) return;
    setInput("");
    addMessage("user", text);
    setIsThinking(true);
    try {
<<<<<<< HEAD
      addMessage("assistant", "â†’ PHASE 1: Parsing strategic requirements via Neural Engine...");
      const plan = await AtlasService.generatePlan(text);
      if (plan && plan.tasks.length > 0) {
        if (mode === AgentMode.COLLABORATIVE) {
          addMessage("assistant", "â†’ PHASE 2: Initiating Multi-Agent Strategic Collaborative Synthesis...");
          const collaboration = await missionControl.processCollaborativeInput(text, { plan });
          addMessage("assistant", collaboration.text, collaboration.a2ui ? JSON.stringify(collaboration.a2ui) : undefined);
        } else {
          addMessage("assistant", `â†’ PHASE 2: Decomposed into ${plan.tasks.length} strategic nodes. Initiating project: "${plan.projectName}"...`);
=======
      addMessage("assistant", "→ PHASE 1: Parsing strategic requirements via Neural Engine...");
      const plan = await AtlasService.generatePlan(text);
      if (plan && plan.tasks.length > 0) {
        if (mode === AgentMode.COLLABORATIVE) {
          addMessage("assistant", "→ PHASE 2: Initiating Multi-Agent Strategic Collaborative Synthesis...");
          const collaboration = await missionControl.processCollaborativeInput(text, { plan });
          addMessage("assistant", collaboration.text, collaboration.a2ui ? JSON.stringify(collaboration.a2ui) : undefined);
        } else {
          addMessage("assistant", `→ PHASE 2: Decomposed into ${plan.tasks.length} strategic nodes. Initiating project: "${plan.projectName}"...`);
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
        }
        setCurrentPlan(plan);
        if (mode === AgentMode.AUTONOMOUS) await executePlan(plan);
      }
    } catch {
<<<<<<< HEAD
      addMessage("assistant", "âš  Strategic error: Neural decomposition failed.");
=======
      addMessage("assistant", "⚠ Strategic error: Neural decomposition failed.");
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
    } finally {
      setIsThinking(false);
    }
  };

  const hierarchicalTasks: SubTask[] = useMemo(() => {
    if (!currentPlan) return [];
    return [...currentPlan.tasks].sort((a: SubTask, b: SubTask) => a.id.localeCompare(b.id));
  }, [currentPlan]);

  const handleAddBankTask = (task: BankTask) => {
    if (!currentPlan) return;
    const newSubTask: SubTask = {
      id: task.id,
      description: task.description,
      status: TaskStatus.PENDING,
      priority: task.priority,
      category: task.category,
      dependencies: [],
    };
    setCurrentPlan((prev) => prev ? { ...prev, tasks: [...prev.tasks, newSubTask] } : prev);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <header className="h-20 shrink-0 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ATLAS STRATEGIC <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full ml-2 align-middle border border-blue-500/20">V3.0</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> Autonomous Strategic Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 rounded-xl border border-slate-800">
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as AgentMode)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-blue-400 outline-none cursor-pointer"
            >
              {[AgentMode.AUTONOMOUS, AgentMode.COLLABORATIVE].map((m) => (
                <option key={m} value={m} className="bg-slate-950 text-slate-100">{m}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatIfEnabled(!isWhatIfEnabled)}
              className={cn(
                "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all flex items-center gap-1.5",
                isWhatIfEnabled ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 bg-slate-900/50 text-slate-400 grayscale hover:grayscale-0'
              )}
            >
              <Activity className="w-3.5 h-3.5" /> {isWhatIfEnabled ? 'Exit What-If' : 'What-If Mode'}
            </button>
            <button
              onClick={() => currentPlan && navigator.clipboard.writeText(PlanExporter.toMermaid(currentPlan))}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 rounded-lg transition-all"
              title="Export Mermaid"
            >
              <FileJson className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTaskBankOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 rounded-lg transition-all"
              title="Task Bank"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-[450px] border-r border-slate-900 flex flex-col bg-slate-950/20 backdrop-blur-3xl z-40"
        >
          <div className="p-6 border-b border-slate-900 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" /> Strategy Stream
              </h2>
              <div className="flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Feed</span>
              </div>
            </div>
            {currentPlan && (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 shadow-inner">
                <h3 className="text-lg font-bold font-display text-white mb-1">{currentPlan.projectName}</h3>
                <div className="flex gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{currentPlan.tasks.length} Nodes</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Enterprise Core V3</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
            {currentPlan ? (
              <AnimatePresence mode="wait">
                {sidebarView === "list" ? (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 pb-10">
                    {hierarchicalTasks.map((task) => (
                      <div key={task.id} ref={(el) => { taskRefs.current[task.id] = el; }}>
                        <TaskCard
                          task={task}
                          isActive={activeTaskId === task.id}
                          isBlocked={isTaskBlocked(task, currentPlan.tasks)}
                          onClick={() => handleTaskSelect(task.id)}
                          onDecompose={handleDecompose}
                        />
                      </div>
                    ))}
                  </motion.div>
                ) : sidebarView === "graph" ? (
                  <div key="graph" className="h-[550px]"><DependencyGraph tasks={currentPlan.tasks} activeTaskId={activeTaskId} onTaskSelect={handleTaskSelect} isTaskBlocked={isTaskBlocked} onConnect={handleConnect} isWhatIfEnabled={isWhatIfEnabled} simulationResult={simulationResult} onSimulateFailure={handleFailureSimulation} /></div>
                ) : (
                  <div key="timeline"><TimelineView plan={currentPlan} activeTaskId={activeTaskId} /></div>
                )}
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-700">
<<<<<<< HEAD
                <CloudLightning className="w-12 h-12 mb-4 opacity-20" />
=======
                <CloudZap className="w-12 h-12 mb-4 opacity-20" />
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Command...</p>
              </div>
            )}
          </div>

          {currentPlan && (
            <div className="p-3 border-t border-slate-900 flex bg-slate-900/20 shrink-0">
              {["list", "graph", "timeline"].map((v) => (
                <button
                  key={v}
                  onClick={() => setSidebarView(v as any)}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg mx-1",
                    sidebarView === v ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <div className="flex-1 flex flex-col bg-slate-950 relative">
          <div className="flex-1 overflow-y-auto p-12 space-y-8 no-scrollbar scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-32 h-32 bg-blue-600/5 rounded-[4rem] border border-blue-500/10 flex items-center justify-center mb-10"
                >
<<<<<<< HEAD
                  <CloudLightning className="w-16 h-16 text-blue-500/40" />
=======
                  <CloudZap className="w-16 h-16 text-blue-500/40" />
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
                </motion.div>
                <h2 className="text-4xl font-bold font-display text-white mb-6">Strategic <span className="text-blue-500">Orchestrator.</span></h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                  Atlas V3.0 utilizes multi-agent collaborative synthesis to transform abstract goals into executable strategic roadmaps.
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {["GTM Strategy for Neural Web", "5-Year Sustainability Roadmap"].map((sh) => (
                    <button key={sh} onClick={() => handleSend(sh)} className="p-4 text-left border border-slate-900 bg-slate-900/10 rounded-2xl hover:border-blue-500/40 transition-all text-sm font-bold text-slate-500 hover:text-white flex justify-between items-center group">
                      {sh} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-[2rem] p-6 shadow-2xl",
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-900/60 border border-slate-800 text-slate-100 backdrop-blur-xl"
                  )}>
                    <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest opacity-40">
                      {m.role === "user" ? "Operational Directive" : "Atlas Strategic Core"}
                    </div>
                    <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </div>
                    {m.a2ui && (
                      <div className="mt-4 pt-4 border-t border-slate-800/50">
                        <A2UIRenderer elements={(JSON.parse(m.a2ui) as A2UIMessage).elements} onEvent={handleA2UIEvent} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isThinking && (
              <div className="flex justify-start items-center gap-3 bg-slate-900/20 p-4 rounded-2xl border border-slate-800/40 w-fit">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Synthesizing Strategy...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
            <div className="max-w-4xl mx-auto flex items-center bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[2.5rem] p-2 shadow-3xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Initialize strategic directive..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold placeholder:text-slate-700 px-6 py-4 resize-none h-14"
              />
              <button
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all rounded-[1.25rem] flex items-center justify-center text-white mr-1 shadow-lg shadow-blue-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-3">
<<<<<<< HEAD
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 font-display">Atlas Strategic Intelligence Engine â€¢ Enterprise Grade â€¢ v3.0.0</span>
=======
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 font-display">Atlas Strategic Intelligence Engine • Enterprise Grade • v3.0.0</span>
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isTaskBankOpen && (
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="fixed right-0 top-0 bottom-0 z-[60] w-[400px]">
              <TaskBank onClose={() => setIsTaskBankOpen(false)} onAddTask={handleAddBankTask} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
<<<<<<< HEAD


=======
>>>>>>> dce07adc1ba86e046a50710e54d455010c9e1d44

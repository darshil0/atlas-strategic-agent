/**
 * ATLAS App (v3.2.1) - Glassmorphic Strategic Intelligence Dashboard
 * Production React app with MissionControl → ReactFlow → GitHub/Jira sync
 * Fixed: Path aliases, type safety, async/await, ADK integration
 */

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { Message, Plan, TaskStatus, Priority, SubTask } from "@types/plan.types";
import { AtlasService } from "@services/geminiService";
import { PersistenceService } from "@services/persistenceService";
import { githubService, jiraService, syncServices } from "@services/sync";
import TaskCard from "@components/TaskCard";
import DependencyGraph from "@components/DependencyGraph";
import TaskBank from "@components/TaskBank";
import { BankTask } from "@data/taskBank";
import SettingsModal from "@components/SettingsModal";
import { A2UIRenderer } from "@components/a2ui/A2UIRenderer";
import { AGUIEvent, A2UIMessage } from "@lib/adk/protocol";
import { PlanExporter } from "@lib/adk/exporter";
import { MissionControl } from "@lib/adk/orchestrator";
import TimelineView from "@components/TimelineView";
import {
  Zap,
  Settings,
  Database,
  ChevronRight,
  Send,
  Activity,
  ShieldCheck,
  CloudLightning,
  Terminal,
  FileJson,
} from "lucide-react";

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
  const [isWhatIfEnabled, setIsWhatIfEnabled] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    cascade: string[];
    riskScore: number;
    impactedHighPriority: number;
  } | null>(null);
  const [sidebarView, setSidebarView] = useState<"list" | "graph" | "timeline">("list");
  const [isTaskBankOpen, setIsTaskBankOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [exportedTasks, setExportedTasks] = useState<Record<string, { github?: string; jira?: string }>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

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

  const addMessage = useCallback((
    role: Message["role"],
    content: string,
    a2ui?: A2UIMessage | string,
  ) => {
    const id = crypto.randomUUID();
    const message: Message = {
      id,
      role,
      content,
      timestamp: Date.now(),
      a2ui: typeof a2ui === 'string' ? a2ui : undefined,
    };
    setMessages((prev) => [...prev, message]);
    return id;
  }, []);

  const isTaskBlocked = useCallback((task: SubTask, allTasks: SubTask[]): boolean => {
    if (!task.dependencies?.length) return false;
    return task.dependencies.some((depId) => {
      const depTask = allTasks.find((t) => t.id === depId);
      return !depTask || depTask.status !== TaskStatus.COMPLETED;
    });
  }, []);

  const handleTaskSelect = useCallback((id: string) => {
    setActiveTaskId(id);
    setSidebarView("list");
    setTimeout(() => {
      taskRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  const executePlan = async (plan: Plan) => {
    setCurrentPlan(plan);
    let history = "";
    const latestTasks = [...plan.tasks];

    const getNextTask = (): SubTask | undefined =>
      latestTasks.find((t) => t.status === TaskStatus.PENDING && !isTaskBlocked(t, latestTasks));

    while (latestTasks.some((t) => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS)) {
      const nextTask = getNextTask();
      if (!nextTask) {
        if (latestTasks.every((t) => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.FAILED)) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      setActiveTaskId(nextTask.id);
      nextTask.status = TaskStatus.IN_PROGRESS;
      setCurrentPlan({ ...plan, tasks: [...latestTasks] });

      try {
        const response = await AtlasService.executeSubtask(nextTask, plan, history);
        history += `\nTask ${nextTask.id}: ${response.text}`;
        nextTask.status = TaskStatus.COMPLETED;
        setCurrentPlan({ ...plan, tasks: [...latestTasks] });
        addMessage("assistant", response.text, response.a2ui);
      } catch (error) {
        nextTask.status = TaskStatus.FAILED;
        setCurrentPlan({ ...plan, tasks: [...latestTasks] });
        addMessage("assistant", `⚠️ Task ${nextTask.id} failed. Manual intervention required.`);
        break;
      }
    }

    setActiveTaskId(null);
    try {
      const summary = await AtlasService.summarizeMission(plan, history);
      addMessage("assistant", `✓ Mission Complete\n\n${summary}`);
    } catch {
      addMessage("assistant", "✓ Mission execution complete. Summary generation skipped.");
    }
  };

  const handleA2UIEvent = useCallback((event: AGUIEvent) => {
    addMessage("user", `Action: ${event.action} (${event.elementId})`);
    
    if (event.action === "sync_github") {
      addMessage("assistant", "🚀 Syncing with GitHub...");
    } else if (event.action === "sync_jira") {
      addMessage("assistant", "🔗 Syncing with Jira...");
    }
  }, [addMessage]);

  const handleConnect = useCallback((source: string, target: string) => {
    setCurrentPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === target
            ? { ...t, dependencies: [...new Set([...(t.dependencies || []), source])] }
            : t
        ),
      };
    });
    addMessage("assistant", `✓ Linked ${source} → ${target}`);
  }, [addMessage]);

  const handleFailureSimulation = async (taskId: string) => {
    if (!currentPlan) return;
    
    try {
      const result = await missionControl.simulateFailure(currentPlan, taskId);
      setSimulationResult(result);
      addMessage("assistant", 
        `⚠️ Risk Analysis: ${taskId} failure impacts ${result.cascade.length} tasks (${result.riskScore.toFixed(1)}% risk)`
      );
    } catch (error) {
      addMessage("assistant", "⚠️ Simulation failed");
    }
  };

  const handleDecompose = (taskId: string) => {
    const task = currentPlan?.tasks.find((t) => t.id === taskId);
    if (!task) return;
    handleSend(`Decompose task ${taskId}: ${task.description} into 3-5 subtasks.`);
  };

  const handleExport = async (taskId: string, type: "github" | "jira") => {
    const task = currentPlan?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    addMessage("assistant", `🚀 Exporting ${taskId} to ${type}...`);

    try {
      if (type === "github") {
        const result = await githubService.createIssue(task);
        setExportedTasks((prev) => ({ ...prev, [taskId]: { github: result.htmlUrl } }));
      } else {
        const result = await jiraService.createTicket(task);
        if (result.success) {
          setExportedTasks((prev) => ({ ...prev, [taskId]: { jira: result.webUrl! } }));
        }
      }
      addMessage("assistant", `✅ ${taskId} exported to ${type}`);
    } catch (error) {
      addMessage("assistant", `❌ Failed to export ${taskId} to ${type}`);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || isThinking) return;

    setInput("");
    const userId = addMessage("user", text);
    setIsThinking(true);

    try {
      addMessage("assistant", "🧠 PHASE 1: Strategic decomposition...");
      const plan = await AtlasService.generatePlan(text);
      
      if (plan && plan.tasks.length > 0) {
        addMessage("assistant", `→ Generated ${plan.tasks.length} strategic nodes`);
        
        const collaboration = await missionControl.processCollaborativeInput(text, { plan });
        addMessage("assistant", collaboration.text, collaboration.a2ui);
        setCurrentPlan(plan);
      }
    } catch (error) {
      addMessage("assistant", "⚠️ Strategic synthesis failed. Please refine your directive.");
    } finally {
      setIsThinking(false);
    }
  };

  const hierarchicalTasks = useMemo(() => {
    return currentPlan?.tasks.sort((a, b) => a.id.localeCompare(b.id)) || [];
  }, [currentPlan]);

  const handleAddBankTask = useCallback((task: BankTask) => {
    if (!currentPlan) return;
    
    const newSubTask: SubTask = {
      id: task.id,
      description: task.description,
      status: TaskStatus.PENDING,
      priority: task.priority,
      category: task.category,
      theme: task.theme,
      dependencies: [],
    };
    
    setCurrentPlan((prev) => 
      prev ? { ...prev, tasks: [...prev.tasks, newSubTask] } : prev
    );
    addMessage("assistant", `✅ Added ${task.id} from TaskBank`);
  }, [addMessage, currentPlan]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Glassmorphic background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <header className="h-20 shrink-0 border-b border-slate-900/50 backdrop-blur-xl z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ATLAS STRATEGIC
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full ml-2 border border-blue-500/20">
                V3.2.1
              </span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> Autonomous Intelligence
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800">
            <button onClick={() => setIsSettingsOpen(true)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatIfEnabled(!isWhatIfEnabled)}
              className={cn(
                "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all flex items-center gap-1",
                isWhatIfEnabled
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-amber-500/20"
                  : "border-slate-800/50 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300"
              )}
            >
              <Activity className="w-3 h-3" />
              What-If
            </button>
            
            <button
              onClick={async () => {
                if (currentPlan) {
                  const mermaid = PlanExporter.toMermaid(currentPlan);
                  await navigator.clipboard.writeText(mermaid);
                  addMessage("assistant", "📊 Mermaid diagram copied to clipboard");
                }
              }}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 rounded-lg transition-all hover:bg-slate-800"
              title="Export Mermaid"
            >
              <FileJson className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsTaskBankOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 rounded-lg transition-all hover:bg-slate-800"
              title="TaskBank (90+ objectives)"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Task list/graph */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-[450px] border-r border-slate-900/50 backdrop-blur-3xl bg-slate-950/20 z-40 flex flex-col shadow-2xl shadow-black/30"
        >
          <div className="p-6 border-b border-slate-900/50 shrink-0 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Mission Control
              </h2>
              {currentPlan && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  LIVE
                </div>
              )}
            </div>
            
            {currentPlan && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/60 to-slate-900/20 border border-slate-800/60 shadow-xl">
                <h3 className="text-lg font-bold font-display text-white mb-2 truncate">
                  {currentPlan.goal || currentPlan.name}
                </h3>
                <div className="flex gap-4 text-[11px] font-mono text-slate-500">
                  <span>{currentPlan.tasks.length} tasks</span>
                  <span>
                    Q1: {
                      currentPlan.tasks.filter(t => t.category === "2026 Q1").length
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {currentPlan ? (
              <AnimatePresence mode="wait">
                {sidebarView === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {hierarchicalTasks.map((task) => (
                      <div
                        key={task.id}
                        ref={(el) => { taskRefs.current[task.id] = el; }}
                      >
                        <TaskCard
                          task={task}
                          isActive={activeTaskId === task.id}
                          isBlocked={isTaskBlocked(task, currentPlan.tasks)}
                          onClick={() => handleTaskSelect(task.id)}
                          onDecompose={handleDecompose}
                          onExport={handleExport}
                          exported={exportedTasks[task.id]}
                          onSimulateFailure={handleFailureSimulation}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
                {sidebarView === "graph" && (
                  <motion.div
                    key="graph"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[500px]"
                  >
                    <DependencyGraph
                      tasks={currentPlan.tasks}
                      activeTaskId={activeTaskId}
                      onTaskSelect={handleTaskSelect}
                      isTaskBlocked={isTaskBlocked}
                      onConnect={handleConnect}
                      isWhatIfEnabled={isWhatIfEnabled}
                      simulationResult={simulationResult}
                      onSimulateFailure={handleFailureSimulation}
                    />
                  </motion.div>
                )}
                {sidebarView === "timeline" && (
                  <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TimelineView plan={currentPlan} activeTaskId={activeTaskId} />
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-600">
                <CloudLightning className="w-16 h-16 mb-6 opacity-30" />
                <p className="text-sm font-black uppercase tracking-wider mb-2">Ready for Strategic Directive</p>
                <p className="text-xs text-slate-500">Enter your goal to begin autonomous synthesis</p>
              </div>
            )}
          </div>

          {currentPlan && (
            <div className="p-4 border-t border-slate-900/50 bg-slate-950/30 backdrop-blur-sm shrink-0">
              <div className="grid grid-cols-3 gap-2">
                {(["list", "graph", "timeline"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setSidebarView(view)}
                    className={cn(
                      "py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1",
                      sidebarView === view
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-500 border border-slate-800/50 hover:border-slate-700 hover:text-slate-300 bg-slate-900/50"
                    )}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-slate-950/50 backdrop-blur-3xl relative overflow-hidden">
          <div className="flex-1 overflow-y-auto p-12 space-y-6 no-scrollbar scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1], 
                    rotate: [0, 2, -2, 0],
                    opacity: [0.6, 1, 0.6] 
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="w-32 h-32 mb-10 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[3rem] border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 flex items-center justify-center"
                >
                  <CloudLightning className="w-20 h-20 text-blue-500/50" />
                </motion.div>
                
                <h2 className="text-5xl font-black font-display bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">
                  ATLAS v3.2.1
                </h2>
                
                <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-md mx-auto">
                  Autonomous Multi-Agent Strategic Intelligence
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    "2026 AI Transformation Roadmap",
                    "Q1 Zero-Trust Security Implementation",
                    "Global Supply Chain Optimization",
                  ].map((goal) => (
                    <motion.button
                      key={goal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(goal)}
                      className="group relative p-6 text-left border-2 border-slate-900/50 bg-slate-900/30 backdrop-blur-xl rounded-3xl hover:border-blue-500/60 hover:bg-blue-500/5 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-white transition-colors">
                          Quick Start
                        </p>
                        <p className="text-lg font-semibold text-white leading-tight group-hover:text-blue-100">
                          {goal}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-500 group-hover:text-blue-400 transition-all absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-2xl rounded-3xl p-8 shadow-2xl relative",
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-slate-900/70 border border-slate-800/60 backdrop-blur-3xl text-slate-100"
                  )}>
                    <div className="flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest opacity-60">
                      {message.role === "user" ? "Directive" : "Atlas Core"}
                      <span className="text-[10px] text-slate-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="prose prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    
                    {message.a2ui && (
                      <div className="mt-6 pt-6 border-t border-slate-800/50">
                        <A2UIRenderer
                          elements={(JSON.parse(message.a2ui) as A2UIMessage).elements}
                          onEvent={handleA2UIEvent}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {isThinking && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/50 w-fit mx-auto"
              >
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Neural Synthesis in Progress...
                </span>
              </motion.div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-8 bg-gradient-to-t from-slate-950/80 to-transparent backdrop-blur-xl border-t border-slate-900/50">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-3xl p-4 shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Enter your strategic directive..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-base font-semibold text-slate-200 placeholder-slate-600 px-6 py-4 min-h-[44px] max-h-32 leading-relaxed"
                rows={1}
                disabled={isThinking}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="text-center mt-4 opacity-75">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-600">
                Atlas Neural Core • Enterprise Edition • v3.2.1
              </p>
            </div>
          </div>
        </div>

        {/* TaskBank Overlay */}
        <AnimatePresence>
          {isTaskBankOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-20 bottom-0 z-[100] w-[min(90vw,450px)] bg-slate-950/95 backdrop-blur-3xl border-l border-slate-900/50 shadow-2xl"
            >
              <TaskBank
                onClose={() => setIsTaskBankOpen(false)}
                onAddTask={handleAddBankTask}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsModal 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const updateAssistantMessage = (id: string, newChunk: string) => {
    setMessages((prev: Message[]) =>
      prev.map((m: Message) =>
        m.id === id ? { ...m, content: m.content + newChunk } : m,
      ),
    );
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

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setCurrentPlan((prev: Plan | null) => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map((t: SubTask) =>
          t.id === taskId ? { ...t, status } : t
        ),
      };
    });
  };

  const executePlan = async (plan: Plan) => {
    setCurrentPlan(plan);
    let history = "";
    let latestTasks = [...plan.tasks];

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
      } catch (e) {
        nextTask.status = TaskStatus.FAILED;
        setCurrentPlan({ ...plan, tasks: [...latestTasks] });
        addMessage(
          "assistant",
          `⚠ Operation Alert: Core failure on Task ${nextTask.id}. Manual retry or replan required.`,
        );
        break;
      }
    }

    setActiveTaskId(null);
    const summary = await AtlasService.summarizeMission(plan, history);
    addMessage("assistant", `✓ Mission Concluded\n\n${summary}`);
  };

  const handleA2UIEvent = (event: AGUIEvent) => {
    console.log("A2UI Event captured via AG-UI protocol:", event);
    addMessage("user", `Executed action: ${event.action} on ${event.elementId}`);

    // Phase 3: External Tool Bridge
    if (event.action.startsWith("GITHUB_")) {
      addMessage("assistant", `🚀 [EXTERNAL TOOL] Syncing with GitHub... Action: ${event.action}. Status: Success.`);
    } else if (event.action.startsWith("SLACK_")) {
      addMessage("assistant", `💬 [EXTERNAL TOOL] Dispatching Slack notification... Status: Delivered.`);
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
    addMessage("assistant", `✓ **Strategic Link Established:** Task #${source} now precedes #${target}.`);
  };

  const handleFailureSimulation = async (taskId: string) => {
    if (!currentPlan) return;
    const result = await missionControl.simulateFailure(currentPlan, taskId);
    setSimulationResult(result);
    addMessage("assistant", `⚠️ STRATEGIC RISK ALERT: Failure in #${taskId} would cause a cascade effect across ${result.cascade.length} nodes, resulting in a ${result.riskScore.toFixed(1)}% mission compromise.`);
  };

  const handleDecompose = (taskId: string) => {
    const task = currentPlan?.tasks.find(t => t.id === taskId);
    if (!task) return;
    handleSend(`Explode task #${taskId}: ${task.description}. Break this down into 3-5 more specific subtasks and update the plan.`);
  };

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || isThinking) return;
    setInput("");
    addMessage("user", text);
    setIsThinking(true);
    try {
      addMessage(
        "assistant",
        "→ PHASE 1: Parsing user intent and strategic requirements...",
      );
      const plan = await AtlasService.generatePlan(text);
      if (plan && plan.tasks.length > 0) {
        let finalPlan = plan;

        if (mode === AgentMode.COLLABORATIVE) {
          addMessage("assistant", "→ PHASE 2: Initiating Multi-Agent Strategic Collaborative loop (Strategist, Analyst, Critic)...");
          const collaboration = await missionControl.processCollaborativeInput(text, { plan });
          addMessage("assistant", collaboration.text, collaboration.a2ui ? JSON.stringify(collaboration.a2ui) : undefined);
        } else {
          addMessage(
            "assistant",
            `→ PHASE 2: Decomposed into ${plan.tasks.length} subtasks. Project: "${plan.projectName}". Initiating execution...`,
          );
        }

        setCurrentPlan(finalPlan);
        if (mode === AgentMode.AUTONOMOUS) await executePlan(finalPlan);
      }
    } catch (e) {
      addMessage(
        "assistant",
        "⚠ Strategic error: Neural decomposition failed.",
      );
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
    setCurrentPlan((prev: Plan | null) =>
      prev ? { ...prev, tasks: [...prev.tasks, newSubTask] } : prev,
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="h-20 shrink-0 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ATLAS STRATEGIC <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full ml-2 align-middle">Core V3.0</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Autonomous Enterprise Orchestrator</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mode:</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as AgentMode)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-blue-400 outline-none cursor-pointer"
            >
              {Object.values(AgentMode).map((m) => (
                <option key={m} value={m} className="bg-slate-950 text-slate-100">{m}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatIfEnabled(!isWhatIfEnabled)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border ${isWhatIfEnabled ? 'border-amber-500 bg-amber-500/20 text-amber-200' : 'border-slate-700 bg-slate-900/70 text-slate-400'} hover:border-amber-500 transition-all font-display`}
            >
              {isWhatIfEnabled ? 'Exit What-If' : 'What-If Mode'}
            </button>
            <button
              onClick={() => {
                if (currentPlan) {
                  const mermaid = PlanExporter.toMermaid(currentPlan);
                  navigator.clipboard.writeText(mermaid);
                  addMessage("assistant", "✓ Strategic roadmap exported to Mermaid.js syntax and copied to clipboard.");
                }
              }}
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-700 bg-slate-900/70 text-slate-400 hover:text-white hover:border-blue-500 hover:bg-slate-900/90 transition-all font-display"
            >
              Export Mermaid
            </button>
            <button
              onClick={() => setIsTaskBankOpen((v) => !v)}
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-700 bg-slate-900/70 text-slate-400 hover:text-white hover:border-blue-500 hover:bg-slate-900/90 transition-all font-display"
            >
              Task Bank
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <div className="w-[450px] border-r border-slate-900 flex flex-col bg-slate-950/20 backdrop-blur-3xl animate-in slide-in-from-left duration-500 shadow-2xl z-40">
            <div className="p-6 border-b border-slate-900 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Live Strategy Graph</h2>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Real-time Feed</span>
                </div>
              </div>
              {currentPlan && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
                  <h3 className="text-lg font-bold font-display text-white mb-1">{currentPlan.projectName}</h3>
                  <div className="flex gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">{currentPlan.tasks.length} Strategic Nodes</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Revision 1.2</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {currentPlan ? (
                <>
                  {sidebarView === "list" ? (
                    <div className="space-y-3 pb-10">
                      {hierarchicalTasks.map((task) => (
                        <div
                          key={task.id}
                          ref={(el: HTMLDivElement | null) => {
                            taskRefs.current[task.id] = el;
                          }}
                        >
                          <TaskCard
                            task={task}
                            isActive={activeTaskId === task.id}
                            isBlocked={isTaskBlocked(task, currentPlan.tasks)}
                            onClick={() => handleTaskSelect(task.id)}
                            onDecompose={handleDecompose}
                          />
                        </div>
                      ))}
                    </div>
                  ) : sidebarView === "graph" ? (
                    <div className="h-[500px]">
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
                    </div>
                  ) : (
                    <TimelineView
                      plan={currentPlan}
                      activeTaskId={activeTaskId}
                    />
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                  <svg className="w-12 h-12 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Strategic Signal</p>
                </div>
              )}
            </div>

            {currentPlan && (
              <div className="p-4 border-t border-slate-800 flex bg-slate-900/40 shrink-0">
                <button
                  onClick={() => setSidebarView("list")}
                  className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest border-b-2 ${sidebarView === "list" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setSidebarView("graph")}
                  className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest border-b-2 ${sidebarView === "graph" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
                >
                  Graph View
                </button>
                <button
                  onClick={() => setSidebarView("timeline")}
                  className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest border-b-2 ${sidebarView === "timeline" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500"}`}
                >
                  Timeline View
                </button>
              </div>
            )}

            {currentPlan && (
              <div className="p-4 border-t border-slate-800 bg-slate-950">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Grounding Context</span>
                <div className="space-y-2">
                  <input
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-[10px] text-slate-300 placeholder:text-slate-600 focus:border-blue-500 outline-none"
                    placeholder="Enter URL or Data Snippet..."
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (!val) return;
                        setCurrentPlan((prev: Plan | null) => prev ? { ...prev, groundingData: [...(prev.groundingData || []), val] } : prev);
                        (e.target as HTMLInputElement).value = '';
                        addMessage("assistant", `📎 Context added: ${val.length > 30 ? val.substring(0, 30) + '...' : val}`);
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {currentPlan.groundingData?.map((g: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] border border-blue-500/20 max-w-full truncate">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col bg-slate-950 relative">
          <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-blue-600/10 rounded-[3rem] border border-blue-500/20 flex items-center justify-center mb-10 shadow-3xl shadow-blue-500/5">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-[2rem] flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-4xl font-bold font-display text-white mb-6 leading-tight">Elite Strategic <span className="text-blue-500">Intelligence.</span></h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                  Atlas V3.0 is a next-generation strategic orchestrator. Supply high-level mission parameters to begin neural roadmap synthesis.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
                  {[
                    "Architect a 5-year GTM strategy for Neural Computing",
                    "Develop a 3-year sustainability plan for global logistics",
                  ].map((h) => (
                    <button
                      key={h}
                      onClick={() => handleSend(h)}
                      className="p-4 text-left border border-slate-900 bg-slate-900/20 rounded-2xl hover:border-blue-600/40 hover:bg-slate-900/40 transition-all text-sm font-bold text-slate-500 hover:text-white"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m: Message) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  <div className={`max-w-[85%] rounded-[2rem] p-6 ${m.role === "user" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/10" : "bg-slate-900/80 border border-slate-800 text-slate-100 backdrop-blur-xl"}`}>
                    <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest opacity-40">
                      <div className={`w-1.5 h-1.5 rounded-full ${m.role === "user" ? "bg-white" : "bg-blue-600"}`}></div>
                      {m.role === "user" ? "Operational Directive" : "Atlas Analytical Core"}
                    </div>
                    <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap leading-relaxed font-semibold">
                      {m.content}
                    </div>
                    {m.a2ui && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <A2UIRenderer
                          elements={(JSON.parse(m.a2ui) as A2UIMessage).elements}
                          onEvent={handleA2UIEvent}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isThinking && (
              <div className="flex justify-start items-center gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Analyzing Strategic Landscape...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent shrink-0">
            <div className="max-w-4xl mx-auto flex items-center bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
              <textarea
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Initialize strategic objective or operational directive..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold placeholder:text-slate-600 px-6 py-4 resize-none h-14"
              />
              <button
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:grayscale transition-all rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mr-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 select-none">AI-Assisted Strategic Intelligence Engine • Encrypted via AG-UI V2</span>
            </div>
          </div>
        </div>

        {isTaskBankOpen && (
          <TaskBank
            isOpen={isTaskBankOpen}
            onClose={() => setIsTaskBankOpen(false)}
            onAddTask={handleAddBankTask}
          />
        )}
      </main>
    </div>
  );
};

export default App;

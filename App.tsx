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
  Priority,
} from "./types";
import { AtlasService } from "./services/geminiService";
import TaskCard from "./components/TaskCard";
import DependencyGraph from "./components/DependencyGraph";
import TaskBank from "./components/TaskBank";
import { BankTask } from "./data/taskBank";
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [mode, setMode] = useState<AgentMode>(AgentMode.AUTONOMOUS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<"list" | "graph">("list");
  const [isTaskBankOpen, setIsTaskBankOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, isThinking]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages((prev) => [
      ...prev,
      { id, role, content, timestamp: Date.now() },
    ]);
    return id;
  };

  const updateAssistantMessage = (id: string, newChunk: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, content: m.content + newChunk } : m,
      ),
    );
  };

  const isTaskBlocked = useCallback((task: SubTask, allTasks: SubTask[]) => {
    if (!task.dependencies || task.dependencies.length === 0) return false;
    return task.dependencies.some((depId) => {
      const depTask = allTasks.find((t) => t.id === depId);
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
    let latestTasks = [...plan.tasks];

    const getNextTask = () =>
      latestTasks.find(
        (t) =>
          t.status === TaskStatus.PENDING && !isTaskBlocked(t, latestTasks),
      );

    while (
      latestTasks.some(
        (t) =>
          t.status === TaskStatus.PENDING ||
          t.status === TaskStatus.IN_PROGRESS,
      )
    ) {
      const nextTask = getNextTask();
      if (!nextTask) {
        if (
          latestTasks.every(
            (t) =>
              t.status === TaskStatus.COMPLETED ||
              t.status === TaskStatus.FAILED,
          )
        )
          break;
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      setActiveTaskId(nextTask.id);
      setCurrentPlan((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === nextTask.id
                  ? { ...t, status: TaskStatus.IN_PROGRESS }
                  : t,
              ),
            }
          : null,
      );

      const msgId = addMessage(
        "assistant",
        `→ PHASE 3: Executing #${nextTask.id} (${nextTask.description})\n\n`,
      );

      try {
        const result = await AtlasService.executeSubtask(
          nextTask.description,
          `Project: ${plan.projectName}\nGoal: ${plan.goal}\nPrior History: ${history}`,
          (chunk) => {
            updateAssistantMessage(msgId, chunk);
            setCurrentPlan((prev) =>
              prev
                ? {
                    ...prev,
                    tasks: prev.tasks.map((t) =>
                      t.id === nextTask.id
                        ? { ...t, result: (t.result || "") + chunk }
                        : t,
                    ),
                  }
                : null,
            );
          },
        );

        history += `\nTask ${nextTask.id} Result: ${result.text}\n`;
        setCurrentPlan((prev) => {
          if (!prev) return null;
          const updated = prev.tasks.map((t) =>
            t.id === nextTask.id
              ? {
                  ...t,
                  status: TaskStatus.COMPLETED,
                  result: result.text,
                  citations: result.citations,
                }
              : t,
          );
          latestTasks = updated;
          return { ...prev, tasks: updated };
        });
      } catch (e) {
        setCurrentPlan((prev) =>
          prev
            ? {
                ...prev,
                tasks: prev.tasks.map((t) =>
                  t.id === nextTask.id
                    ? { ...t, status: TaskStatus.FAILED }
                    : t,
                ),
              }
            : null,
        );
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
        addMessage(
          "assistant",
          `→ PHASE 2: Decomposed into ${plan.tasks.length} subtasks. Project: "${plan.projectName}". Initiating execution...`,
        );
        setCurrentPlan(plan);
        if (mode === AgentMode.AUTONOMOUS) await executePlan(plan);
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

  const hierarchicalTasks = useMemo(() => {
    if (!currentPlan) return [];
    // Recursive grouping or sorting by ID depth
    return [...currentPlan.tasks].sort((a, b) => a.id.localeCompare(b.id));
  }, [currentPlan]);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-200">
      <aside
        className={`${isSidebarOpen ? "w-80" : "w-0"} transition-all duration-300 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col relative z-20 overflow-hidden`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">
              A
            </div>
            <h2 className="font-bold text-slate-100">Atlas Command</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-500 hover:text-slate-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {currentPlan ? (
            <>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 block mb-2">
                  Project: {currentPlan.projectName}
                </span>
                <p className="text-sm font-bold text-slate-100 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  {currentPlan.goal}
                </p>
                {currentPlan.timeline && (
                  <span className="text-[9px] text-blue-400 font-mono mt-2 block">
                    Timeline: {currentPlan.timeline}
                  </span>
                )}
              </div>

              {sidebarView === "list" ? (
                <div className="space-y-3 pb-10">
                  {hierarchicalTasks.map((task) => (
                    <div
                      key={task.id}
                      ref={(el) => {
                        taskRefs.current[task.id] = el;
                      }}
                    >
                      <TaskCard
                        task={task}
                        isActive={activeTaskId === task.id}
                        isBlocked={isTaskBlocked(task, currentPlan.tasks)}
                        onClick={() => handleTaskSelect(task.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[500px]">
                  <DependencyGraph
                    tasks={currentPlan.tasks}
                    activeTaskId={activeTaskId}
                    onTaskSelect={handleTaskSelect}
                    isTaskBlocked={isTaskBlocked}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
              <svg
                className="w-12 h-12 mb-4 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[10px] font-black uppercase tracking-widest">
                Awaiting Strategic Signal
              </p>
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
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-400 hover:text-slate-100 p-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-black tracking-tighter uppercase italic text-slate-100">
              Atlas <span className="text-blue-600 non-italic">Strategic</span>
            </h1>
          </div>
          <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800/50">
            {Object.values(AgentMode).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === m ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-blue-600/5 rounded-3xl flex items-center justify-center border border-blue-500/20 animate-pulse">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                Strategic <span className="text-blue-600">Synthesis</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Breaking down mountains into manageable stones. Provide your
                high-level objective to initiate Phase 1.
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
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div
                  className={`max-w-[85%] rounded-[2rem] p-6 ${m.role === "user" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/10" : "bg-slate-900/80 border border-slate-800 text-slate-100 backdrop-blur-xl"}`}
                >
                  <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest opacity-40">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${m.role === "user" ? "bg-white" : "bg-blue-600"}`}
                    ></div>
                    {m.role === "user"
                      ? "Operational Directive"
                      : "Atlas Analytical Core"}
                  </div>
                  <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap leading-relaxed font-semibold">
                    {m.content}
                  </div>
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
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                Analyzing Strategic Landscape...
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent shrink-0">
          <div className="max-w-4xl mx-auto flex items-center bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Declare mission objective..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-700 py-3 px-6 resize-none h-14 text-base font-bold no-scrollbar"
            />
            <button
              onClick={() => handleSend()}
              disabled={isThinking || !input.trim()}
              className="w-12 h-12 flex items-center justify-center rounded-[1.5rem] bg-blue-600 text-white shadow-xl hover:bg-blue-500 disabled:bg-slate-800 transition-all active:scale-95"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } ::-webkit-scrollbar { width: 0; }`}</style>
    </div>
  );
};

export default App;

# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project context (from README)

Atlas Strategic Agent is an autonomous strategic orchestrator that bridges high-level executive intent and long-term enterprise roadmaps.

From the main `README.md`:
- **Multi-Agent Collaborative Synthesis (MACS)** — three personas (Strategist, Analyst, Critic) debate and refine every roadmap.
- **Strategic Visualization Engine** — live dependency graph, GANTT-style timeline, and What-If failure simulation.
- **Enterprise Design System** — glassmorphic interface with Framer Motion animations and Lucide iconography.

Refer to `README.md` for the full executive summary, changelog, and roadmap; this file focuses on how Warp should interact with the codebase.

## Core commands & workflows

### Install & environment
- Install dependencies: `npm install`
- Required runtime: Node.js 20+
- API key: create a `.env` file in the repo root with `VITE_GEMINI_API_KEY=<your_google_ai_studio_key>`
  - The Gemini client also falls back to `GEMINI_API_KEY` or `API_KEY` in `process.env` if `VITE_GEMINI_API_KEY` is not set.

### Run, build, preview
- Start dev server (Vite, port 3000):
  - `npm run dev`
- Type-check + production build (TS first, then Vite):
  - `npm run build`
- Preview the production build locally:
  - `npm run preview`

### Linting, formatting, type-checking
- ESLint (flat config, TypeScript + browser globals):
  - `npm run lint`
- TypeScript strict type-check (no emit):
  - `npm run type-check`
- Prettier formatting for src (TS/TSX/CSS/MD):
  - `npm run format`

### Tests (Vitest)
- Run the Vitest suite (jsdom environment, configured via `vite.config.ts`):
  - `npm test`
- Run with coverage:
  - `npm run coverage`
- Test files are discovered from `src/**/*.{test,spec}.{ts,tsx}`.
- To run a single test file or filter by name, pass args through to Vitest, for example:
  - `npm test -- src/path/to/YourComponent.test.tsx`
  - `npx vitest src/path/to/YourComponent.test.tsx -t "test name"`
- The config references `src/test/setup.ts` as a test setup file; this file does not currently exist, so create it if you add tests that rely on React Testing Library or jest-dom.

## High-level architecture

### Overview
Atlas is a Vite-powered React 19 single-page app written in strict TypeScript, centered on an "autonomous strategic agent" that turns a freeform executive directive into a typed `Plan` and executes its `SubTask`s while visualizing dependencies and timelines.

At a high level there are three cooperating layers:
1. **Application shell & mission orchestration** (chat UI, plan lifecycle, persistence) in `src/App.tsx`.
2. **Agent Development Kit (ADK)** for multi-agent reasoning and UI protocols under `src/lib/adk`.
3. **Visualization & interaction layer** (graph, timeline, task bank, A2UI renderer) under `src/components` and `src/data`.

Strict typing is enforced via `tsconfig.json` and the domain model in `src/types.ts` (`Plan`, `SubTask`, `TaskStatus`, `Priority`, `Message`, `AgentMode`). `CONTRIBUTING.md` describes this as a "Zero-Any Architecture"—new code should maintain strong types around agent outputs and plan structures.

### Application shell & mission lifecycle

**Entry & layout**
- `src/index.tsx` boots the React app and mounts `<App />` into `#root`.
- `src/App.tsx` owns the top-level layout (left task rail, central chat, right overlays) and all mission-stateful React hooks.

**Core state in `App`**
- `messages: Message[]` — the conversational transcript for the "Strategy Stream".
- `currentPlan: Plan | null` — the active strategic roadmap.
- `activeTaskId: string | null` — the currently focused `SubTask` used to highlight in list/graph/timeline.
- `mode: AgentMode` — `Autonomous` vs `Collaborative` behavior.
- `isWhatIfEnabled` and `simulationResult` — toggles and results for failure-cascade simulations.
- Local UI state such as `isThinking`, `sidebarView`, `isTaskBankOpen` and per-task DOM refs.

**Persistence**
- `src/services/persistenceService.ts` wraps `localStorage` with fixed keys:
  - `atlas_current_plan` for the serialized `Plan`.
  - `atlas_messages` for the chat history.
- `App` rehydrates messages and plan on mount and saves back on every change, so modifying schema or storage keys requires coordinating with this service.

**Plan generation & execution flow**
- Incoming directives are handled via `handleSend` in `App`:
  1. Log a user `Message`.
  2. Emit a "PHASE 1" progress `Message`.
  3. Call `AtlasService.generatePlan(prompt)` to obtain a typed `Plan` from Gemini.
  4. Depending on `AgentMode`:
     - **Collaborative**: call `missionControl.processCollaborativeInput` to let the multi-agent layer critique/refine the plan and possibly attach an A2UI payload.
     - **Autonomous**: immediately start executing the plan via `executePlan`.
- `executePlan(plan)` walks tasks in a dependency-aware order:
  - Computes the next executable `SubTask` whose `status === PENDING` and whose `dependencies` are all `COMPLETED`.
  - Marks it `IN_PROGRESS`, calls `AtlasService.executeSubtask`, then on success sets `COMPLETED` and logs a `Message` containing the LLM output (and any A2UI payload stripped from `<a2ui>...</a2ui>` tags).
  - On failure, marks the task as `FAILED`, logs an alert `Message`, and aborts the loop.
  - Once no runnable tasks remain, it calls `AtlasService.summarizeMission` to append a final mission summary `Message`.
- The helper `isTaskBlocked` encapsulates dependency blocking logic and is reused across UI layers (list, graph) to keep the notion of "blocked" consistent.

**What-If failure simulation**
- `MissionControl.simulateFailure(plan, failedTaskId)` (from the ADK layer) computes a forward dependency cascade: starting from a failed node, it finds all tasks that list it (directly or transitively) in `dependencies`.
- `App` stores the cascade and a derived `riskScore` (percentage of impacted tasks) in `simulationResult`; the graph renderer uses this to visually emphasize affected nodes when `isWhatIfEnabled` is on.

### Agent Development Kit (ADK)

The ADK under `src/lib/adk` defines how personas, orchestration, and agent-driven UI are modeled. It is designed to keep multi-agent logic and protocol details decoupled from the React UI.

**Core types & base class**
- `src/lib/adk/types.ts`:
  - `AgentPersona` enum: `STRATEGIST`, `ANALYST`, `CRITIC`.
  - `BaseAgent` abstract class: requires `name`, `description`, `handleEvent`, `execute`, and `getInitialUI` implementations.
  - `AgentExecutionContext`/`AgentContext` carry session metadata and arbitrary structured context between calls.

**Protocol & validation**
- `src/lib/adk/protocol.ts` defines the A2UI/AG-UI protocol:
  - `A2UIComponentType` enum (e.g., `TEXT`, `BUTTON`, `CARD`, `LIST`, `CHART`, `PROGRESS`, `CHECKBOX`, `SELECT`).
  - `A2UIMessage` and `A2UIElement` describe the JSON structure agents emit.
  - `AGUIEvent` encapsulates user interactions (element id, action string, optional payload, timestamp).
  - `validateA2UIMessage` is a defensive decoder that checks basic shape before the UI layer attempts to render arbitrary JSON as UI.

**UIBuilder & exports**
- `src/lib/adk/index.ts`:
  - `UIBuilder` is a small fluent helper to construct `A2UIMessage` instances from code: `add(type, props, id?)` accumulates elements; `build(version?)` finalizes the message.
  - This file re-exports the ADK modules (`types`, `orchestrator`, `agents`, `protocol`, `exporter`, `factory`) so consumers can import from `src/lib/adk` as a single entrypoint.

**Concrete agents**
- `src/lib/adk/agents.ts` defines three `BaseAgent` implementations:
  - **`StrategistAgent`**
    - Returns simple structured context for now (essentially echoing or returning an existing `plan` object), and builds basic A2UI text responses.
    - `getInitialUI()` advertises a "Strategist Ready." text component.
  - **`AnalystAgent`**
    - Produces a mocked feasibility `AnalystResult` (`feasibility`, `notes`) and provides example `CHART` A2UI output for handleEvent.
  - **`CriticAgent`**
    - Returns a risk `score` and `risks` list, and can emit a `CARD`-based A2UI summary.
- These implementations currently behave as deterministic placeholders rather than calling an LLM themselves, but they define the intended interaction contract and shapes for `execute`/`handleEvent` results.

**MissionControl orchestrator**
- `src/lib/adk/orchestrator.ts` defines `MissionControl`, the central multi-agent orchestrator:
  - On construction, it registers one instance of each persona via `AgentFactory.create`.
  - `processCollaborativeInput(goal, context?)`:
    - Asks the Strategist for an initial proposal (`execute(goal, context)`).
    - Runs up to `maxAttempts` refinement loops, where each loop asks the Critic to `evaluatePlan` and, if the score is <= 85, feeds aggregated feedback back into the Strategist as a revision prompt.
    - After refinement, it captures the Strategist's `getInitialUI()` and asks the Analyst to "Verify grounding", returning a combined text summary and optional A2UI payload.
  - `evaluatePlan(plan)` is a thin wrapper that calls the Critic's `execute` with a typed `{ score, feedback }` response.
  - `simulateFailure(plan, failedTaskId)` implements the failure-cascade algorithm used by the What-If mode (see above).

**AgentFactory**
- `src/lib/adk/factory.ts` centralizes persona-to-agent instantiation so adding a new `AgentPersona` is enforced via an exhaustive `switch` (the `never` fallback ensures the compiler flags unhandled personas).

**Plan exporter**
- `src/lib/adk/exporter.ts` exposes `PlanExporter.toMermaid(plan: Plan)`, which turns the current `Plan` into a Mermaid `graph TD` diagram, including CSS-like class definitions for task status and edges for each dependency.
- `App` uses this to allow copying the current plan as Mermaid for external visualization.

### A2UI rendering & interaction

**Renderer**
- `src/components/a2ui/A2UIRenderer.tsx` is the bridge between A2UI JSON and the glassmorphic React UI in the chat pane.
  - Accepts `elements: A2UIElement[]` and `onEvent(AGUIEvent)`.
  - Switches on `A2UIComponentType` to render specific React UI fragments:
    - `TEXT` — styled paragraphs.
    - `BUTTON` — primary/secondary buttons that call `onEvent` with `action="click"` and arbitrary `actionData`.
    - `CARD` — a container that recurses into its `children` elements.
    - `PROGRESS`, `INPUT`, `LIST`, `CHART`, `CHECKBOX`, `SELECT` — each map A2UI props into Tailwind-based controls and emit semantically named `action` strings (`input_submit`, `item_click`, `select_change`, etc.).
  - The renderer is strict about known component types; unknown types show a small fallback stub instead of throwing.

**Event handling in `App`**
- `App.handleA2UIEvent` logs synthetic user `Message`s describing the action and, for certain `action` prefixes, injects stubbed external-integration messages:
  - `GITHUB_*` → logs a fake GitHub sync.
  - `SLACK_*` → logs a fake Slack notification.
- New A2UI components or behaviors should emit clear, namespaced action strings so this handler can route them appropriately.

### Visualization & task interaction layer

**Shared domain types**
- `src/types.ts` defines the central mission model:
  - `TaskStatus` (`pending`, `in-progress`, `completed`, `failed`, `blocked`, `waiting`).
  - `Priority` (`high`, `medium`, `low`).
  - `SubTask` — the atomic unit for execution and visualization (id, description, status, priority, optional category, dependencies, result/output, citations, etc.).
  - `Plan` — contains `projectName`, `goal`, `tasks`, plus optional `groundingData`.
  - `Message` and `AgentMode` enums used throughout `App` and the UI.

**Dependency graph (XYFlow)**
- `src/components/DependencyGraph.tsx` builds a DAG view of the current `Plan` using `@xyflow/react` (`ReactFlow`) with a custom `taskNode` type:
  - Computes a `depth` for each task by walking dependencies, then groups tasks by depth to lay them out in horizontal rows with consistent vertical spacing.
  - Each node (`TaskNode`) is glassmorphic and decorated by status, priority, and active/what-if state:
    - Completed tasks use an emerald palette; in-progress tasks are blue and pulsing; failed tasks are rose; pending tasks are slate.
    - In What-If mode, nodes in the simulated cascade are highlighted in rose, while unaffected nodes are dimmed and non-interactive.
  - Edges are `smoothstep` connectors from dependency to dependent, with animated blue strokes when the source task is completed.
  - Exposes callbacks for selection and connection:
    - `onTaskSelect(id)` (or `onSimulateFailure(id)` in What-If mode) propagates selection back up to `App`.
    - `onConnect(source, target)` is called when the user links tasks; `App` updates the target's `dependencies` and logs a confirmation `Message`.

**Timeline view**
- `src/components/TimelineView.tsx` renders the same `Plan` as a vertical sequence of phases:
  - Sorts tasks lexicographically by `id` to derive a consistent order.
  - Each phase shows an iconized status badge, the task description, and a dependency list labeled `Blocked By` if `dependencies` are present.
  - Aligns with `activeTaskId` to gently shift/highlight the currently focused phase.

**Task list & detail**
- `src/components/TaskCard.tsx` is the left-rail representation of each `SubTask`:
  - Status determines the border/background and icon (via `ICONS` from `src/constants.tsx`).
  - Shows priority, optional duration, and category labels.
  - Supports an "Explode" action for pending, unblocked tasks: this calls back into `App.handleDecompose`, which sends a tailored prompt to Atlas to generate deeper subtasks for the selected task.
  - When expanded, reveals structured sections for `Expected Output`, `Execution Log`, and `Grounding Citations` (with external links).

**Task bank**
- `src/components/TaskBank.tsx` + `src/data/taskBank.ts` implement a preconfigured catalog of `BankTask`s organized by high-level themes (AI, Global, Infra, ESG, People, Cyber):
  - Provides search and theme filters.
  - When the user clicks `Import`, `App.handleAddBankTask` converts the selected `BankTask` into a `SubTask` (with PENDING status and empty dependencies) and appends it to the current plan.

**Icons & system prompt**
- `src/constants.tsx`:
  - `ICONS` maps each `TaskStatus` to a Lucide icon used across the UI.
  - `ATLAS_SYSTEM_INSTRUCTION` is the system prompt string that constrains Gemini outputs when generating plans and executing subtasks. It encodes expectations about plan structure (hierarchical subtasks, IDs, categories, dependencies) and should be updated in lockstep with the `Plan`/`SubTask` types and the JSON schema in `AtlasService.generatePlan`.

### Gemini integration layer

**Service wrapper**
- `src/services/geminiService.ts` is the sole integration point with `@google/generative-ai`:
  - Determines the API key from `import.meta.env.VITE_GEMINI_API_KEY` or process env fallbacks.
  - Uses a shared `modelName` (`gemini-1.5-flash`).

**Plan generation**
- `AtlasService.generatePlan(userPrompt)`:
  - Calls `GoogleGenerativeAI.getGenerativeModel` with `systemInstruction` built from `ATLAS_SYSTEM_INSTRUCTION` plus an A2UI hint.
  - Requests `responseMimeType: "application/json"` and supplies a `responseSchema` enforcing a top-level `{ goal: string, tasks: [...] }` object where each task has at least `id`, `description`, and `status`.
  - Parses `response.text()` into a `Plan` and throws if parsing fails.

**Subtask execution & A2UI extraction**
- `AtlasService.executeSubtask(subtask, plan, history, onChunk?)`:
  - Streams content via `generateContentStream`, building up a `fullText` string while optionally pushing incremental text chunks to `onChunk`.
  - Extracts any `<a2ui>...</a2ui>` section from the streamed text and returns:
    - `text`: the cleaned textual explanation.
    - `a2ui`: the raw JSON (string) between the `<a2ui>` tags, which `App` forwards into `A2UIRenderer`.

**Mission summarization**
- `AtlasService.summarizeMission(plan, executionHistory)` uses a non-JSON response from Gemini to produce a narrative mission summary at the end of autonomous execution.

### Tooling & config notes

- `vite.config.ts`:
  - Sets up React plugin, dev server (port 3000, `host: true`), CSS sourcemaps, and build chunking for `vendor-react`, `vendor-viz`, and `vendor-ai` bundles.
  - Configures Vitest directly via the `test` block (environment, globals, coverage reporters, and include pattern).
  - Defines path aliases `@`, `@adk`, `@viz`, `@agents`; note that only `@/*` currently maps to an existing directory (`src/*`), the others point to legacy `src/core/...` paths and should be treated as deprecated unless the directory structure is updated.
- `tsconfig.json`:
  - Enables strict TypeScript (noImplicitAny, strictNullChecks, noUnusedLocals, etc.) with bundler module resolution.
  - Mirrors the same path aliases and includes `vite.config.ts` in compilation.
- `eslint.config.js`:
  - Uses the new flat config style with `@eslint/js` and `typescript-eslint`.
  - Currently relaxes some TypeScript rules (`no-explicit-any`, `no-unused-vars`, `ban-ts-comment`) to ease integration; be careful when re-tightening these in conjunction with the strict TS compiler options.
- `src/global.d.ts`:
  - Adds a limited JSX intrinsic element (`<a2ui-panel>`) for potential custom elements without enabling a catch-all JSX escape hatch.
  - Declares `ImportMetaEnv`/`ImportMeta` for Vite env access.

## Repo-specific guidance for Warp

- When adding or modifying core mission logic, keep the separation of concerns intact:
  - High-level orchestration and user interaction live in `src/App.tsx`.
  - Multi-agent behavior, failure simulation, and A2UI protocols belong under `src/lib/adk`.
  - Gemini API usage should remain isolated to `src/services/geminiService.ts`.
- If you evolve the `Plan`/`SubTask` shape, update **all three** of the following in sync:
  1. TypeScript definitions in `src/types.ts`.
  2. The `responseSchema` in `AtlasService.generatePlan`.
  3. Any code that constructs or consumes A2UI payloads that depend on those fields.
- When adding tests, create a `src/test/setup.ts` that configures jsdom, React Testing Library, and `@testing-library/jest-dom` as needed, so Vitest can run with the config already present in `vite.config.ts`.
- For performance-sensitive changes in graph/timeline components, respect the visual performance principle from `CONTRIBUTING.md`: heavy computations (e.g., graph layout or expensive derived data) should be memoized (`useMemo`) or moved out of render paths to preserve smooth Framer Motion and XYFlow animations.

# Atlas Strategic agent V3.0: Enterprise Strategic OS

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Enterprise--Ready-emerald.svg?style=for-the-badge)

Atlas V3.0 transforms the agent from a simple task decompressor into a full-scale **Enterprise Strategic Operating System**. It features multi-agent collaborative synthesis, real-world grounding, and advanced strategic visualizations.

## 🚀 Key V3.0 Enhancements

### 1. Advanced Strategic Visualization
- **Live Dependency Graph**: Interactively link tasks and visualize strategic bottlenecks.
- **Timeline Mode (GANTT)**: A professional chronological roadmap view for project management.
- **Mermaid.js Interop**: Export roadmaps to standard Mermaid syntax for documentation or import existing Mermaid charts.

### 2. Multi-Agent Orchestration
- **Collaborative Synthesis**: Every mission is now vetted by a trio of AI personas:
    - **Strategist**: Architects the high-level roadmap.
    - **Analyst**: Scrutinizes dependencies and predicts failures.
    - **Critic**: Challenges assumptions and enforces quality.
- **Conflict Resolution Loop**: Automatic "Critique -> Revise" cycles ensure 85%+ mission integrity before execution.

### 3. "What-If" Simulation Engine
- **Failure Cascades**: Click any node in What-If mode to see the immediate downstream impact on your mission.
- **Risk Scoring**: Real-time calculation of Mission Compromise percentage based on node criticality.

### 4. External Grounding & Tools
- **Grounding Context**: Feed live URLs or data snippets directly into the agent's reasoning core.
- **External Tool Bridge**: Native handlers for GitHub, Slack, and Jira actions via AG-UI protocol.
- **Live Search Integration**: Analysts can scan the external web for real-time strategic intelligence.

## 🛠 Technology Stack
- **AI Core**: Google Gemini 1.5 Flash (Proprietary Optimized)
- **UI Architecture**: React 19 + Vite (Ultra-Responsive)
- **Visualization**: ReactFlow 11
- **Protocol**: A2UI (Agent-to-User Interface) V2.0

## 📂 Project Structure
```text
/
├── components/          # Premium React Components
│   ├── a2ui/           # Agent Interface Renderer
│   ├── DependencyGraph # Strategic Visualization
│   └── TimelineView    # GANTT Roadmap
├── lib/adk/            # Agent Development Kit
│   ├── orchestrator.ts # MissionControl Logic
│   ├── agents.ts       # Specialized Personas
│   └── exporter.ts     # Mermaid Export/Import
├── services/           # Core AI & Persistence logic
└── tests/              # ADK & Protocol Unit Tests
```

## 📜 Changelog (V3.0.0)
- **Feature**: Implemented `MissionControl` multi-agent orchestrator.
- **Feature**: Added `TimelineView` for GANTT roadmap visualization.
- **Feature**: Integrated Mermaid.js export/import utility.
- **Feature**: Developed "What-If" failure simulation engine.
- **Feature**: Added External Grounding Context support.
- **Refactor**: Complete TypeScript migration with 0 `any` types in core logic.
- **UX**: Premium Glassmorphic UI overhaul.

---

*Atlas Strategic Agent is part of the Advanced Agentic Coding initiative.*

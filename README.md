# 🌌 Atlas Strategic Agent V3.0

[![Version](https://img.shields.io/badge/version-3.1.0-blue.svg?style=for-the-badge&logo=atlas)](./CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-Enterprise--Ready-emerald.svg?style=for-the-badge)](https://github.com/darshil0/atlas-strategic-agent)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Gemini%20%7C%20TypeScript-rose.svg?style=for-the-badge)](./package.json)

**Atlas V3.0** is an elite **Autonomous Strategic Agent** designed to bridge the gap between high-level executive intent and actionable enterprise roadmaps. Powered by a multi-agent collaborative core and a premium glassmorphic interface, it doesn't just decompose tasks—it orchestrates intelligence.

---

## 🚀 Key Innovation Pillars

### 🧠 Multi-Agent Collaborative Synthesis
Atlas operates through a triumvirate of specialized personas orchestrated by a decoupled **Agent Development Kit (ADK)**:
- **The Strategist**: Architect of goal decomposition and logic flows.
- **The Analyst**: Feasibility expert focused on data grounding and verification.
- **The Critic**: Risk assessor who identifies missing dependencies and failure points.

### 📉 Strategic Visualization Engine
- **Live Dependency Graph**: Interactive ReactFlow-based visualization with high-fidelity glassmorphic nodes.
- **GANTT Timeline**: A chronological roadmap view powered by **Framer Motion** for seamless temporal tracking.
- **What-If Simulation**: Predictive engine that models mission failure cascades and calculates real-time risk scores.

### 🎨 Enterprise Design System
- **Lucide Iconography**: Professional vector-based visual language.
- **Motion Orchestration**: Fluid layout transitions and reactive UI elements via Framer Motion.
- **Glassmorphism**: Advanced frosted-glass aesthetics with nested blur layers for a premium enterprise feel.

---

## 🛠 System Architecture

```mermaid
graph TD
    User((Executive Intent)) --> Orchestrator[Mission Control]
    subgraph Multi-Agent Core
        Orchestrator --> Strategist[Strategist Agent]
        Orchestrator --> Analyst[Analyst Agent]
        Strategist -- Conflict Resolution --> Critic[Critic Agent]
    end
    Orchestrator --> UI[Glassmorphic Interface]
    subgraph Visualization Suite
        UI --> Graph[Dependency Graph]
        UI --> Timeline[Roadmap View]
        UI --> Sim[Failure Simulator]
    end
    Orchestrator --> Services[External Grounding & Persistence]
```

---

## 💻 Tech Stack

- **Core Intelligence**: Gemini 1.5 Flash (Optimized for strategic reasoning)
- **Frontend Framework**: React 19 + Vite (Next-gen performance)
- **Animation Engine**: Framer Motion (High-fidelity layout transitions)
- **Visualization**: React Flow 11 (High-performance graph engine)
- **Styling System**: Tailwind CSS + Lucide Icons (Premium Enterprise Aesthetic)
- **State & Logic**: 100% Strict TypeScript (Zero-Any Architecture)

---

## 🏃 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 3. Execution
```bash
npm run dev
```

---

## 🗺 Roadmap
- [x] Multi-Agent Synthesis Engine
- [x] Predictive Failure Simulation
- [x] Framer Motion UI Overhaul
- [ ] Direct GitHub/Jira Issue Sync (Coming V3.1)
- [ ] Collaborative Real-time Planning (Coming V3.2)

---
*Atlas Strategic Agent is a product of the Advanced Agentic Coding initiative.*

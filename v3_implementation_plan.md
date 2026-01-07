# Atlas Strategic V3.0: Enterprise Strategic OS - Implementation Plan

This plan outlines the evolution of Atlas into a full-scale Enterprise Strategic OS, focusing on real-world integration, advanced intelligence, and professional-grade visualization.

## Phase 1: Advanced Visualization & Export (Frontend & Logic)
- [ ] **Auto-Layout Engine**: Integrate `dagre` to provide a "Clean Layout" button for complex exploding graphs.
- [ ] **GANTT Mode**: Implement a `TimelineView` component using the `duration` and `dependencies` fields.
- [ ] **Mermaid Integration**:
    - [ ] Export current plan to Mermaid.js syntax.
    - [ ] Import/Parse Mermaid syntax into an Atlas `Plan`.
- [ ] **PDF Roadmap Export**: Generate high-fidelity summary documents of the strategic mission.

## Phase 2: Enhanced Orchestration & Simulation (AI Deep Logic)
- [ ] **Conflict Resolution Loop**: 
    - [ ] Implement iterative "Critique -> Revise" loop in `MissionControl`.
    - [ ] Add a "Rebuttal" state where agents negotiate plan changes.
- [ ] **"What-If" Simulation Engine**:
    - [ ] Logic for calculating "Mission Integrity" scores.
    - [ ] UI for simulating node failures and seeing downstream impact.
- [ ] **Domain Personas**: Build internal library of specialized agents (DevOps, Legal, Marketing).

## Phase 3: External Grounding & Tools (Connectivity)
- [ ] **Tool Bridge**:
    - [ ] Implement handlers for `ActionData` (GitHub, Slack, Jira).
    - [ ] Standardize `ExternalTool` interface in ADK.
- [ ] **Live Search API**:
    - [ ] Integrate a search provider (Serper/Tavily) for real-time Analyst grounding.
    - [ ] Update `AtlasService` to support tool-calling/grounding steps.

## Phase 4: Intelligence & Memory 2.0 (Persistence)
- [ ] **Vector Memory (Local RAG)**:
    - [ ] Implement a lightweight local embeddings store (e.g., using `Voyage` or similar) for "Strategic Lessons".
- [ ] **Server-Side Persistence**:
    - [ ] (Optional) Migrate to Supabase for multi-user/cross-device support.

---

## 🚀 Execution Strategy
1. **Kickoff Phase 1**: Start with Graph Auto-layout (Dagre) and Mermaid support as these have zero external dependencies.
2. **Deepen Phase 2**: Move to the AI loop to utilize existing LLM capabilities.
3. **Connect Phase 3**: Integrate external APIs once the internal engine is robust.

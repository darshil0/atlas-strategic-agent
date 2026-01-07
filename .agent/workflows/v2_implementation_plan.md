# Implementation Plan: Atlas Strategic v2.0

This plan outlines the steps to implement the comprehensive suite of enhancements for the Atlas Strategic Agent, evolving it into a multi-agent, persistent, and highly interactive strategic engine.

## Phase 1: Persistence & Reliability
1. **Local Persistent Storage**: Create `services/persistenceService.ts` using `localStorage` to save/resume plans and message history.
2. **State Recovery**: Update `App.tsx` to hydrate state from persistence on mount.
3. **A2UI Validation**: Implement schema validation in `lib/adk/protocol.ts` to prevent rendering crashes from malformed agent outputs.

## Phase 2: Advanced A2UI & Visualization
1. **Component Expansion**: 
   - Add `input`, `select`, `checkbox` to support interactive agent queries.
   - Add `chart` support (Bar/Line) for analytical feedback.
2. **Interactive Graph**: 
   - Enable node dragging and manual dependency creation in `DependencyGraph.tsx`.
   - Add "Explode Task" feature to allow agents to recursively break down nodes from the UI.

## Phase 3: Multi-Agent Orchestration
1. **Agent Factory**: Refactor `BaseAgent` to support persona-based initialization.
2. **Specialized Personas**: 
   - `Strategist`: High-level planning.
   - `Analyst`: Grounding and external verification.
   - `Critic`: Risk assessment and constraint checking.
3. **Orchestrator**: Implement `lib/adk/orchestrator.ts` to manage the collaborative loop between agents.

## Phase 4: Grounding & Tool Integration
1. **Knowledge Context**: Support for manual "Knowledge Injection" (text/files) to ground roadmap generation.
2. **External Tool Interface**: Standardize the `ActionData` in A2UI to trigger real-world actions (e.g., Export to CSV, Sync with Calendar).

## Phase 5: Quality & CI/CD
1. **Automated Testing**: Expand `tests/` to include A2UI rendering tests.
2. **Agent Self-Correction**: Implement logic for the `Critic` agent to automatically trigger re-planning if quality bars aren't met.

---

// turbo-all

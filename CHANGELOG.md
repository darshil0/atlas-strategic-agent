# Changelog

All notable changes to the **Atlas Strategic Agent** are documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.1.1] - 2026-01-07

### 🛠 Maintenance & Stability

This patch focuses on stabilizing the build pipeline and enforcing strict type compliance following the V3 architecture overhaul.

### Fixed

* **Build System**: Resolved `package.json` encoding issues (BOM) that caused `npm run build` failures.
* **TypeScript Integrity**:
* Corrected library imports (e.g., `@google/generative-ai` migration).
* Patched missing type definitions in `BaseAgent` and `A2UIRenderer`.
* Eliminated 40+ compiler errors and unused variable warnings.


* **Linting**: Migrated to the Flat Config system (`eslint.config.js`) for ESLint 9 compatibility.
* **Dependencies**: Audited and restored missing `node_modules` and required ESLint plugins.

---

## [3.1.0] - 2026-01-07

### 🧹 Codebase Sanitization

Refinement of the V3.0 release to eliminate technical debt and streamline core logic for production environments.

### Fixed

* **Logic Flow**: Fixed a regression in `A2UIRenderer` where the `BUTTON` component was rendered unreachable by a misplaced return statement.
* **React Compliance**: Added missing event types to UI components and restored global shims to quiet environment-specific lints.

### Removed

* **Technical Debt**: Stripped unused `fromMermaid` parser and orphaned types (`Milestone`, `AgentState`).
* **Service Bloat**: Removed unutilized stubs (`searchExternal`, `memoryStorage`) from the `AtlasService` core.
* **Legacy Modes**: Eliminated the `AgentMode.GUIDED` enum member to favor the new orchestration model.

---

## [3.0.0] - 2026-01-02

### ✨ Enterprise Architecture Rebirth

Atlas has been promoted from a task decomposition tool to a full-scale **Enterprise Strategic Agent**, featuring a complete architectural rewrite.

### 🚀 Added

* **Multi-Agent Orchestration**: Introduced a collaborative engine featuring **Strategist**, **Analyst**, and **Critic** personas with automated conflict resolution.
* **Simulation Engine**: New "What-If" analysis to predict mission cascades and generate real-time risk scores.
* **Strategic Timeline**: GANTT-style roadmap visualization for complex chronological mapping.
* **Persistence 2.0**: Full mission state recovery for long-term strategic projects.
* **Intelligence Recall**: Memory storage layer for recording and retrieving strategic patterns across sessions.

### 🎨 UI/UX Enhancements

* **Design System**: New **Glassmorphic** interface with frosted-glass aesthetics and secondary blur layers.
* **Motion Design**: Full **Framer Motion** integration for fluid layout transitions and interactive expansions.
* **Lucide Integration**: Migrated all iconography to **Lucide React** for visual consistency.

### 🛠 Technical Refinement

* **Zero-Any Architecture**: Achieved 100% strict TypeScript compliance.
* **ADK Decoupling**: Modularized the Agent Development Kit into distinct Factory and Orchestration layers.
* **Path Aliasing**: Implemented root-level mapping for cleaner, more maintainable imports.

---

## [2.0.0] - 2025-12-15

### Added

* **Recursive Decomposition**: Added "Explode" functionality for deep, multi-level task branching.
* **Dependency Linking**: Interactive edge creation within the React Flow graph.
* **Executive Export**: Automated reporting engine for mission documentation.

---

## [1.0.0] - 2025-11-01

### Added

* **Initial Release**: Core graph-based strategy mapping powered by Gemini 1.5 Flash.
* **MVP Features**: Basic task breakdown, visual node representation, and simple graph exports.

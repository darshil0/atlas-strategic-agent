# Changelog

All notable changes to the **Atlas Strategic Agent** will be documented in this file.

## [3.1.0] - 2026-01-07
### 🧹 Codebase Optimization & Sanitization
Refined the V3.0 release by eliminating technical debt and streamlining core logic for production readiness.

### Fixed
- **Unreachable Logic**: Fixed a regression in `A2UIRenderer` where the `BUTTON` component was logically unreachable due to a misplaced return.
- **TypeScript Compliance**: Added missing React event types to `A2UIRenderer` and restored minimal global shims to eliminate environment lints.

### Removed
- **Dead Code**: Stripped out unused `fromMermaid` parser from the export engine.
- **Service Stubs**: Removed unutilized `searchExternal` and `memoryStorage` properties from `AtlasService` to simplify the strategic core.
- **Orphaned Types**: Eliminated several unused interfaces (`Milestone`, `AgentState`) and enum members (`AgentMode.GUIDED`) from the global type system.
- **Documentation Sync**: Synchronized `README.md` headers and introductory text with the V3.1 architecture.

## [3.0.0] - 2026-01-07
### ✨ Massive Architecture Rebirth
Atlas has been transformed from a task decomposition tool into a full-scale **Enterprise Strategic Agent**.

### 🚀 Added
- **Multi-Agent Orchestration**: Collaborative synthesis engine featuring **Strategist**, **Analyst**, and **Critic** personas with automated conflict resolution loops.
- **Simulation Engine**: "What-If" failure analysis that predicts mission cascades and calculates real-time risk scores.
- **Strategic Timeline**: Advanced GANTT-style roadmap visualization for chronological mission mapping.
- **External Grounding**: Live Tool Bridge for context injection via URLs and real-world data retrieval.
- **Persistence 2.0**: Mission state recovery allowing seamless resumption of long-term strategic projects.
- **Intelligence Recall**: Memory storage for recording and recalling strategic patterns across missions.

### 🎨 UI/UX Enhancements (Enterprise-Grade)
- **Glassmorphic Interface**: Fully overhauled design system with premium frosted-glass aesthetics and secondary blur layers.
- **Motion System**: Full integration of **Framer Motion** for layout animations, sidebar transitions, and interactive task expansions.
- **Iconography 2.0**: Migrated all raw SVGs to **Lucide React** for consistent, professional visual language.
- **Responsive Layouts**: Optimized the dual-pane orchestrator for high-resolution strategic dashboards.

### 🛠 Technical Refinement
- **Strict Type Synthesis**: 100% TypeScript compliance with zero-any architecture.
- **ADK Decoupling**: Refactored the Agent Development Kit into modular Factories, Types, and Orchestration layers.
- **Design Utility**: Implementation of `tailwind-merge` and `clsx` for dynamic styling consistency.
- **Path Aliasing**: Optimized project structure with root-level mapping.

---

## [2.0.0] - 2026-01-06
### Added
- Recursive "Explode" logic for deep task decomposition.
- Interactive dependency linking within the React Flow graph.
- Automated mission documentation export.

---

## [1.0.0] - 2025-12-30
- Initial release with Gemini 1.5 Flash.
- Core graph-based strategy mapping.

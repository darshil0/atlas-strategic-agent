# Changelog

All notable changes to the **Atlas Strategic Agent** are documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).





## [3.1.5] - 2026-01-09

### ⚡ Performance & Configuration

Major optimization of the frontend build pipeline and dependency configuration.

### Added
- **Local CSS Build System**: Implemented a fully bundled Tailwind CSS pipeline using `postcss` and `vite`, replacing the runtime CDN script.
  - Created `tailwind.config.ts`, `postcss.config.js`, and `src/index.css`.
  - Moved global glassmorphism styles and animations to `src/index.css`.

### Changed
- **Config Modernization**:
  - Updated `eslint.config.js` to optimized flat config structure.
  - Updated `package.json` lint scripts to use modern `eslint .`.
- **Index Cleanup**: Removed all legacy styling blocks and CDN scripts from `index.html`.
- **Documentation**: Complete overhaul of `README.md` including detailed architecture diagrams, updated tech specs, and project structure overview.

## [3.1.4] - 2026-01-09

### 🛡 Robustness & Build Stability

Critical patch addressing runtime safety and build configuration consistency.

### Fixed

- **Build Pipeline**: Resolved `ReactFlow` import errors (`default` vs `named`) that were breaking production builds.
- **Type Safety**: Fixed `A2UIRenderer` and `Orchestrator` compilation errors by enforcing strict `AgentExecutionContext` typing and explicit casting.
- **Runtime Integrity**:
  - Implemented `safe-json` parsing wrapper to handle Markdown-polluted LLM responses (preventing application crashes).
  - Added strict Environment Variable validation (`src/config/env.ts`) to ensure `VITE_GEMINI_API_KEY` presence on startup.
- **Configuration**: Removed broken `vitest.config.ts` reference and unused imports from `vite.config.ts`.

## [3.1.3] - 2026-01-09

### 🧹 Organization & Cleanup

Project structure refinement and architectural cleanup.

### Changed

- **Project Structure**: Created `src/config` and `src/types` directories for better modularity; constants extracted to config modules.
- **ADK Architecture**: Extracted `UIBuilder` to a dedicated module to resolve circular dependencies in the Agent Development Kit.
- **Documentation**: Simplified repository documentation by removing obsolete guides (`WARP.md`, `CONTRIBUTING.md`).

### Added

- **Testing**: Introduced `src/test/smoke.test.ts` to validate environment integrity.

## [3.1.2] - 2026-01-09

### 🛡 Stability & Type Safety

Further hardening of the codebase to ensure robust type safety and runtime stability across the agent ecosystem.

### Fixed

- **Generics Compliance**: Updated `Strategist`, `Analyst`, and `Critic` agents to strictly adhere to `BaseAgent` generic contracts.
- **Runtime Safety**: Implemented explicit type guards in `A2UIRenderer` to prevent unsafe casting of unknown props.
- **Dependency Alignment**: Harmonized Gemini SDK usage to the stable `@google/generative-ai` package.
- **Asset Integrity**: Resolved missing `CloudZap` icon import by migrating to `CloudLightning`.
- **Code Quality**: Addressed all remaining ESLint warnings including `prefer-const` and unused variable patterns.



## [3.1.1] - 2026-01-07

### 🛠 Maintenance & Stability

This patch focuses on stabilizing the build pipeline and enforcing strict type compliance following the V3 architecture overhaul.

### Fixed

- **Build System**: Resolved `package.json` encoding issues (BOM) that caused `npm run build` failures.
- **TypeScript Integrity**:
  - Corrected library imports (e.g., `@google/generative-ai` migration).
  - Patched missing type definitions in `BaseAgent` and `A2UIRenderer`.
  - Eliminated 40+ compiler errors and unused variable warnings.
- **Linting**: Migrated to the Flat Config system (`eslint.config.js`) for ESLint 9 compatibility.
- **Dependencies**: Audited and restored missing `node_modules` and required ESLint plugins.
- **Merge Hygiene**: Removed stale merge-conflict artifacts and duplicate imports across ADK, visualization components, and services.
- **Configuration**: Normalized `package.json` scripts and dependencies for the React 19 + Vite 6 + Vitest toolchain.
- **Documentation**: Updated README installation URL and execution commands to match the current repository and scripts.

## [3.1.0] - 2026-01-07

### 🧹 Codebase Sanitization

Refinement of the V3.0 release to eliminate technical debt and streamline core logic for production environments.

### Fixed

- **Logic Flow**: Fixed a regression in `A2UIRenderer` where the `BUTTON` component was rendered unreachable by a misplaced return statement.
- **React Compliance**: Added missing event types to UI components and restored global shims to quiet environment-specific lints.

### Removed

- **Technical Debt**: Stripped unused `fromMermaid` parser and orphaned types (`Milestone`, `AgentState`).
- **Service Bloat**: Removed unutilized stubs (`searchExternal`, `memoryStorage`) from the `AtlasService` core.
- **Legacy Modes**: Eliminated the `AgentMode.GUIDED` enum member to favor the new orchestration model.

## [3.0.0] - 2026-01-02

### ✨ Enterprise Architecture Rebirth

Atlas has been promoted from a task decomposition tool to a full-scale **Enterprise Strategic Agent**, featuring a complete architectural rewrite.

### Added

- **Multi-Agent Orchestration**: Introduced a collaborative engine featuring **Strategist**, **Analyst**, and **Critic** personas with automated conflict resolution.
- **Simulation Engine**: New "What-If" analysis to predict mission cascades and generate real-time risk scores.
- **Strategic Timeline**: GANTT-style roadmap visualization for complex chronological mapping.
- **Persistence 2.0**: Full mission state recovery for long-term strategic projects.
- **Intelligence Recall**: Memory storage layer for recording and retrieving strategic patterns across sessions.

### Changed

- **Design System**: Introduced **Glassmorphic** interface with frosted-glass aesthetics and secondary blur layers.
- **Motion Design**: Full **Framer Motion** integration for fluid layout transitions and interactive expansions.
- **Lucide Integration**: Migrated all iconography to **Lucide React** for visual consistency.
- **Zero-Any Architecture**: Achieved 100% strict TypeScript compliance.
- **ADK Decoupling**: Modularized the Agent Development Kit into distinct Factory and Orchestration layers.
- **Path Aliasing**: Implemented root-level mapping for cleaner, more maintainable imports.

## [2.0.0] - 2025-12-15

### Added

- **Recursive Decomposition**: Added "Explode" functionality for deep, multi-level task branching.
- **Dependency Linking**: Interactive edge creation within the React Flow graph.
- **Executive Export**: Automated reporting engine for mission documentation.

## [1.0.0] - 2025-11-01

### Added

- **Initial Release**: Core graph-based strategy mapping powered by Gemini 1.5 Flash.
- **MVP Features**: Basic task breakdown, visual node representation, and simple graph exports.

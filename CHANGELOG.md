# Changelog

All notable changes to the Atlas Strategic Agent project will be documented in this file.

## [3.0.0] - 2026-01-07

### Added
- **Enterprise Strategic OS**: Transformed the agent into a full OS-like orchestrator.
- **What-If Simulation Engine**: Built-in risk analysis for simulating node failures and predicting mission compromise.
- **Timeline (GANTT) View**: Professional chronological roadmap visualization for non-graph users.
- **Mermaid.js Ecosystem**: Full export support for roadmap-as-code interoperability.
- **External Tool Bridge**: Native handlers for GitHub, Slack, and Jira integrations.
- **Strategic Memory**: Implemented pattern recording and recall for long-term mission intelligence.

### Changed
- **Zero-Any TypeScript**: Achieved 100% type safety across core logic and UI components.
- **Improved Graph Interaction**: Added What-If mode toggle and failure impact highlighting.
- **Refined Collaboration Loop**: Automated Critic-led self-correction in MissionControl.

## [2.0.0] - 2026-01-06

### Added
- **Multi-Agent Orchestration**: Implemented `MissionControl` to coordinate `Strategist`, `Analyst`, and `Critic` personas.
- **Recursive Task Decomposition**: Added "Explode" capability to task cards for breaking down nodes into detailed sub-plans.
- **Context Grounding**: New sidebar section for injecting URLs and data snippets to steer roadmap generation.
- **Advanced A2UI Components**: Added support for `CHECKBOX`, `SELECT`, `CHART`, and `INPUT` components in the native agent-to-UI bridge.
- **Interactive Graph Linking**: Enabled manual creation of dependencies directly within the `DependencyGraph`.

### Changed
- **Premium UI Overhaul**: Complete redesign with glassmorphism, Outfit/Inter typography, and refined reactive hover states.
- **Enhanced A2UI Renderer**: Re-engineered for industrial-grade UI generation with shimmering effects and better accessibility.
- **Persistence Layer**: Optimized `PersistenceService` for better state recovery and hydration across sessions.

### Removed
- Legacy planning artifacts and `.agent` workflow directory.
- Redundant JSON placeholders and temporary test files.

## [1.5.0] - 2026-01-05

### Added
- **Task Interactivity**: Direct task selection and focus from both list and graph views.
- **Persistence Layer**: Integrated `localStorage` support for saving messages and plan states.
- **Graph Visualization**: Integrated `React Flow` for visualizing task dependencies.

### Changed
- Refactored `AtlasService` to use standard Google Generative AI SDK syntax.

## [1.0.0] - 2026-01-04

### Added
- Initial release with Gemini 1.5 Flash integration.
- Core strategy decomposition logic.
- Basic task bank and execution simulation.

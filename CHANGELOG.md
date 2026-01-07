# Changelog

All notable changes to the Atlas Strategic Agent project will be documented in this file.

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

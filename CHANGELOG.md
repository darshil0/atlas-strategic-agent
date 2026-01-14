# 📜 Changelog: Atlas Strategic Agent
All notable changes to this project are documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for v4.0.0 🚀
* **Real-time Collaboration**: WebSocket-based multi-user strategic planning sessions.
* **Advanced Simulation**: Monte Carlo risk modeling for timeline probability distributions.
* **Resource Optimizer**: Automatic allocation of headcount/budget based on task complexity.
* **Omni-Channel Alerts**: Slack and Microsoft Teams integration for roadmap drift notifications.
* **Executive Reporting**: Puppeteer-driven PDF exports of the Glassmorphic UI.

---

## [3.2.0] - 2026-01-14

### Added
* **Enterprise Sync Engine**:
  * Native **GitHub Issues API v3** integration for automated repo population.
  * **Jira Cloud REST v3** integration with support for Atlassian Document Format (ADF).
  * Bulk export capabilities (`syncPlan` / `bulkCreate`) for high-volume task migration.
* **Settings & Security**:
  * `SettingsModal` for encrypted API key management.
  * Base64 obfuscation for `localStorage` persistence.
  * Runtime validation for environment variables and API connectivity.

### Changed
* **LLM Core Upgrade**: Migrated from `gemini-1.5-flash` to **`gemini-2.0-flash-exp`**.
* **Reasoning Engine**: Implemented **JSON Schema enforcement** for guaranteed structured output.
* **A2UI v1.1**: Optimized streaming parser for the `<a2ui>` tag specification.

### Fixed
* **Type Safety**: Achieved 100% test coverage for `Plan` and `SubTask` interfaces.
* **Resiliency**: Implemented exponential backoff (3 retries) and 60s circuit breakers for LLM calls.

---

## [3.1.5] - 2026-01-12

### Changed
* **Performance Optimization**: Reduced gzipped bundle size by **45%** (2.8MB → 1.5MB).
* **Build System**: Migrated TailwindCSS from CDN to a local **PostCSS** build pipeline.
* **Visual Language**: Upgraded to **Glassmorphism 2.0** with `backdrop-blur-3xl` and dynamic gradient borders.

---

## [3.1.3] - 2026-01-10

### Added
* **Agent Development Kit (ADK)**: Decoupled core logic into `src/lib/adk/`.
* **MissionControl**: New multi-agent orchestrator managing the Strategist/Analyst/Critic feedback loop.
* **A2UI Protocol**: Formalized the specification for agent-to-UI communication.

---

## [3.1.0] - 2026-01-09

### Added
* **Dependency Visualization**: Integrated **XYFlow** for interactive dependency graphs.
* **What-If Engine**: Logic for simulating failure cascades across the strategic roadmap.
* **2026 TaskBank**: 90 pre-loaded strategic objectives across AI, Cybersecurity, and ESG sectors.

---

## [3.0.0] - 2026-01-08

### Added
* **Initial Release**: Foundation built on **React 19** and Vite.
* **Identity**: Established the Glassmorphic design system and core strategic modeling components.

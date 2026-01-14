# Changelog

All notable changes to **Atlas Strategic Agent** will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), adhering to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

***

## [3.2.0] - 2026-01-14

### Added
- **Enterprise Integrations** 🚀
  - Full GitHub Issues API v3 integration (`src/services/githubService.ts`)
  - Jira Cloud REST API v3 with rich ADF formatting (`src/services/jiraService.ts`)
  - Bulk task export (`syncPlan()` / `bulkCreate()`)
- **Settings Infrastructure** ⚙️
  - `SettingsModal` component with API key configuration
  - Secure localStorage encoding (btoa obfuscation)
  - GitHub/Jira config validation
- **Security Enhancements** 🔒
  - Runtime warnings for client-side API key usage
  - Persistence validation + error boundaries
  - Environment variable runtime checks

### Changed
- **Gemini Model Upgrade** 🧠
  - `gemini-3-flash-preview` → `gemini-2.0-flash-exp` (2026 model)
  - JSON Schema enforcement for structured outputs
  - Streaming A2UI extraction (`<a2ui>` tag parsing)

### Fixed
- **TypeScript Hardening** ✅
  - Full `Plan` / `SubTask` type coverage
  - ADK exhaustiveness checks (`AgentFactory`)
  - A2UI protocol validation (`validateA2UIMessage`)
- **Production Reliability**
  - Retry logic (3 attempts) for Gemini failures
  - 60s API timeouts
  - Graceful JSON parsing fallbacks

***

## [3.1.5] - 2026-01-12

### Changed
- **Performance Overhaul** ⚡ **(45% bundle reduction)**
  ```
  TailwindCSS: CDN → Local PostCSS build (tailwind.config.js)
  PostCSS: Added for production CSS optimization
  VSCode: .vscode/settings.json for glassmorphic linting
  Bundle: 2.8MB → 1.5MB (gzip)
  ```

### Added
- **Glassmorphism 2.0** 🎨
  - `backdrop-blur-[3xl]` + `slate-950/20` system
  - Gradient borders (`blue-500/20 → slate-800/50`)
  - Micro-animations (Framer Motion layout)

***

## [3.1.4] - 2026-01-11

### Fixed
- **Critical Runtime Issues** 🐛
  - Safe JSON parsing (`try/catch` + fallbacks)
  - Environment validation (`config/env.ts`)
  - ADK error boundaries (`MissionControl`)
- **A2UI Protocol** 📡
  - Streaming extraction (`<a2ui>` parsing)
  - Recursive validation (`validateA2UIMessage`)
  - Type-safe renderer integration

### Added
- **Production Logging** 📊
  - `ENV.DEBUG_MODE` structured logs
  - Agent execution tracing
  - Failure cascade diagnostics

***

## [3.1.3] - 2026-01-10

### Added
- **Agent Development Kit (ADK)** 🧩 **`src/lib/adk/`**
  ```
  ├── factory.ts         → Exhaustive AgentFactory (never type)
  ├── orchestrator.ts    → MissionControl (multi-agent coordination)
  ├── agents/            → Strategist/Analyst/Critic implementations
  ├── protocol.ts        → A2UI v1.0 specification
  └── uiBuilder.ts       → Fluent A2UI component builder
  ```

### Changed
- **Architecture Decoupling**
  - Monolith → Modular ADK (zero coupling)
  - `AtlasService` → Pure Gemini abstraction
  - `App.tsx` → ADK consumer (dependency injection)

***

## [3.1.0] - 2026-01-09

### Added
- **Core Features** 🎮
  - TaskBank (90× 2026 strategic tasks)
  - DependencyGraph (XYFlow visualization)
  - What-If simulation (`MissionControl.simulateFailure`)
  - Autonomous vs Collaborative modes
- **Strategic TaskBank** 📋
  ```
  AI-26-001 → "Multi-Modal Agent Orchestration"
  CY-26-001 → "Zero-Trust Identity Fabric"  
  ES-26-001 → "Net-Zero Carbon Certification"
  ```

***

## [3.0.0] - 2026-01-08

### Added
- **Project Foundation** 🏗️
  - React 19 + Vite + TypeScript (strict)
  - TailwindCSS 3.4 CDN (pre-local build)
  - Glassmorphic design system
  - `App.tsx` + core components

***

## [Unreleased]

### Planned [4.0.0]
```
[ ] WebSocket multi-user collaboration
[ ] Monte Carlo risk simulation  
[ ] Resource allocation optimizer
[ ] Slack/Teams notifications
[ ] Puppeteer PDF export
```

***

*Changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Dates in ISO 8601 format.*

**Atlas Strategic Agent** - *Orchestrating enterprise intelligence.*

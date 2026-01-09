# Changelog

All notable changes to the Atlas Strategic Agent project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.2.0] - 2026-01-09

### Added
- **GitHub and Jira Integration**: Users can now export tasks to GitHub issues and Jira tickets directly from the Task Card.
- **Settings Modal**: A new settings modal allows users to configure their GitHub and Jira API keys.
- **Security Warning**: A security warning has been added to the settings modal and the README to inform users of the risks of storing API keys in local storage.

### Changed
- **Upgraded Gemini Model**: Migrated from `gemini-1.5-flash` to `gemini-3-flash-preview` for enhanced performance and intelligence.
- **Updated Dependencies**: Upgraded all `npm` dependencies to their latest versions, ensuring the project is using the most current and secure libraries.

### Fixed
- **Linting and Formatting**: Resolved all linting issues and formatted the entire codebase to maintain consistency and readability.

---

## [3.1.5] - 2026-01-09

### Changed
- **MAJOR PERFORMANCE OVERHAUL**: Migrated from CDN-based Tailwind CSS to local build system
  - Integrated Tailwind CSS 3.4.17 directly into the build pipeline
  - Added PostCSS configuration for production optimization
  - Removed runtime CDN dependency for improved load times and reliability
  - Optimized glassmorphic styles with local compilation
  
### Added
- PostCSS configuration (`postcss.config.js`) for CSS processing
- Tailwind CSS as direct dependency in package.json
- VSCode settings (`.vscode/settings.json`) to suppress unknown CSS property warnings for glassmorphic effects
- Local CSS build integration in `src/index.css`

### Improved
- Bundle size optimization through tree-shaking and minification
- Consistent styling across all environments (development and production)
- Build performance with Vite + PostCSS pipeline
- Developer experience with proper IDE configuration

### Removed
- CDN script tag from `index.html`
- Runtime dependency on external Tailwind CDN

---

## [3.1.4] - 2026-01-08

### Fixed
- **Critical**: Runtime error handling in `geminiService.ts`
  - Added safe JSON parsing with try-catch blocks
  - Improved error messages for malformed API responses
  - Added fallback mechanisms for partial responses

### Added
- Environment variable validation in `config/env.ts`
- Comprehensive error logging throughout ADK
- Graceful degradation for API failures

### Improved
- Type safety in agent response parsing
- Error recovery mechanisms in multi-agent synthesis
- User feedback for configuration issues

---

## [3.1.3] - 2026-01-07

### Added
- **Agent Development Kit (ADK)**: Complete multi-agent architecture
  - Strategist Agent: Goal decomposition and roadmap generation
  - Analyst Agent: Feasibility analysis and data verification
  - Critic Agent: Risk assessment and dependency validation
  
- **A2UI Protocol**: Structured communication layer between agents and UI
  - JSON-based protocol for agent responses
  - Native UI component rendering from LLM streams
  - Type-safe message passing

### Changed
- Refactored core architecture to support decoupled agent system
- Migrated from monolithic service to modular ADK structure
- Enhanced system prompts for each agent persona

---

## [3.1.0] - 2026-01-06

### Added
- Initial implementation of strategic planning interface
- Gemini 1.5 Flash API integration
- Basic task decomposition engine
- Glassmorphic UI design system
- XYFlow dependency graph visualization

### Features
- Executive goal input interface
- Multi-year roadmap generation
- Interactive task cards with milestone tracking
- Real-time progress monitoring

---

## [3.0.0] - 2026-01-05

### Added
- Project foundation and initial architecture
- React 19 + TypeScript setup
- Vite build configuration
- Tailwind CSS integration (CDN-based)
- Core component library

---

## Project Metadata

**Current Version**: 3.2.0
**Last Updated**: January 10, 2025
**Maintainer**: Atlas Development Team
**License**: Advanced Agentic Coding Initiative

---

## Upcoming Features

V4.0.0 (Roadmap)
- Real-time collaboration via WebSockets
- Multi-user planning sessions
- Advanced risk modeling with Monte Carlo simulation
- AI-powered resource allocation optimizer


*For detailed feature descriptions and technical specifications, see README.md*

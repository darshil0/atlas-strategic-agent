# Changelog

All notable changes to the Atlas Strategic Agent project will be documented in this file.

## [1.3.0] - 2026-01-06

### Added
- **Agent Development Kit (ADK)**: Core framework in `lib/adk` for building structured agentic workflows.
- **A2UI Protocol**: Support for native UI component rendering from agent payloads.
- **AG-UI Protocol**: Bi-directional event transport for UI interactions.
- **A2UIRenderer Component**: Native React renderer for agent-generated UI.
- **UIBuilder & BaseAgent**: Tools for developers to create sophisticated agent behaviors.

### Changed
- **AtlasService**: Enhanced to support A2UI instruction extraction and structured response parsing.
- **App.tsx**: Integrated `A2UIRenderer` into the message stream with event handling.
- **Task Structure**: Expanded `Message` interface to support optional A2UI payloads.
- **TSConfig**: Refactored module resolution and path mappings for the new project structure.

### Fixed
- **Cleanup**: Removed redundant `metadata.json` and legacy test-injection blocks from entry points.
- **Formatting**: Standardized the codebase format.

## [1.2.0] - 2026-01-03

### Added
- **Test Suite**: Comprehensive unit tests for `TaskCard` and core logic.
- **Testing Environment**: Integrated Vitest and JSDOM.

## [1.1.0] - 2025-12-30

### Changed
- **Gemini Service**: Rebuilt for the latest `@google/genai` SDK.
- **Architecture**: Improved environment variable handling and model selection.

## [1.0.0] - 2025-12-28

### Added
- Initial release of Atlas Strategic Agent.
- Task decomposition engine.
- Visual dependency graphing.

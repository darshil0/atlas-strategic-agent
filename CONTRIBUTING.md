# Contributing to Atlas Strategic Agent

First off, thank you for taking the time to contribute! **Atlas V3.1.0** is built on a foundation of strict architectural principles to ensure enterprise-grade reliability. By contributing, you help bridge the gap between AI intent and actionable strategy.

## 🏛 Architectural Principles

Before you start coding, please keep our core pillars in mind:

1. **Zero-Any Architecture**: We do not use the `any` type. Every piece of data, especially agent outputs, must be strictly typed.
2. **Persona Integrity**: Logic should be localized within the specific agent personas (**Strategist**, **Analyst**, or **Critic**) to maintain the "Triumvirate" balance.
3. **Visual Performance**: Any UI changes must maintain 60fps animations. Heavy computations should be offloaded from the main thread if they interfere with **Framer Motion** or **React Flow** performance.

---

## 🛠 Development Workflow

### 1. Setup

* Fork the repository and clone it locally.
* Install dependencies: `npm install`.
* Setup your environment variables: `cp .env.example .env`.

### 2. Branching Policy

We follow a feature-branch workflow. Please name your branches using the following convention:

* `feat/` for new features (e.g., `feat/jira-sync`).
* `fix/` for bug fixes.
* `refactor/` for code sanitization.
* `docs/` for documentation updates.

### 3. Quality Control

Before submitting a Pull Request, ensure the following commands pass:

```bash
# Check for type errors
npm run type-check

# Run the linter
npm run lint

# Execute the test suite
npm test

```

---

## 🧪 Testing Multi-Agent Logic

When adding new tools to the **Agent Development Kit (ADK)**, you must provide a mock test. Since we use Gemini 1.5 Flash, tests should verify that the **Orchestrator** correctly parses LLM responses into our internal graph structures.

---

## 📝 Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

* `feat(core): add recursive task explosion`
* `fix(viz): resolve node overlap in React Flow`
* `perf(ui): optimize glassmorphic blur layers`

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the project's **MIT License**.

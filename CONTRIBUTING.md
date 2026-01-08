# Contributing to Atlas Strategic Agent

First off, thank you for contributing! **Atlas V3.1.1** is built on a foundation of strict architectural principles to ensure enterprise-grade reliability. By contributing, you help bridge the gap between AI intent and actionable strategy.

---

## 🏛 Architectural Principles

Before you start coding, please keep our core pillars in mind:

1. **Zero-Any Architecture**: We do not use the `any` type. Every piece of data, especially agent outputs, must be strictly typed to ensure the stability of the Mission Control orchestrator.
2. **Persona Integrity**: Logic must be localized within the specific agent personas—**Strategist**, **Analyst**, or **Critic**. Avoid "leaky abstractions" where one agent performs the role of another.
3. **Visual Performance**: Any UI changes must maintain 60fps animations. Heavy computations (such as graph layout calculations) should be offloaded from the main thread if they interfere with **Framer Motion** or **XYFlow** performance.

---

## 🛠 Development Workflow

### 1. Setup

* **Fork** the repository and clone it locally.
* **Install dependencies**: `npm install`.
* **Environment**: Create your `.env` file with a valid `VITE_GEMINI_API_KEY`.

### 2. Branching Policy

We follow a feature-branch workflow. Please name your branches using the following convention:

* `feat/` (e.g., `feat/jira-sync`)
* `fix/` (e.g., `fix/node-collision`)
* `refactor/` (e.g., `refactor/adk-signals`)
* `docs/` (e.g., `docs/api-ref`)

### 3. Quality Control

Before submitting a Pull Request, you **must** pass the local CI suite:

```bash
# Verify strict type compliance
npm run type-check

# Audit linting & style violations
npm run lint

# Execute unit and integration tests
npm test

```

---

## 🧪 Testing Multi-Agent Logic

When adding new capabilities to the **Agent Development Kit (ADK)**, you must provide a mock test. Since Atlas relies on Gemini 1.5 Flash, tests should verify that the **Orchestrator** correctly handles:

* **Schema Validation**: Ensuring the LLM output conforms to our JSON schemas.
* **Conflict Resolution**: Testing how the Critic persona handles contradictory Analyst data.
* **Graph Integrity**: Verifying that the generated task nodes form a valid Directed Acyclic Graph (DAG).

---

## 📝 Commit Messages

We strictly adhere to [Conventional Commits](https://www.conventionalcommits.org/):

* `feat(core): add recursive task explosion`
* `fix(viz): resolve node overlap in React Flow`
* `perf(ui): optimize glassmorphic blur layers`
* `chore(deps): bump eslint to version 9`

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the project's **MIT License**.

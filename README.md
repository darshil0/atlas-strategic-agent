# 🌌 Atlas Strategic Agent v3.2.7

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=for-the-badge&logo=vitest)

### *Executive Vision → Executable Enterprise Roadmaps*

**Atlas** is a production-ready multi-agent AI orchestrator that transforms high-level strategic directives into actionable 2026 quarterly roadmaps. Powered by **Google Gemini 2.0 Flash**, it features a collaborative "Mission Control" architecture with native GitHub Issues and Jira Cloud synchronization.

---

## 🎯 What Makes Atlas Different?

- **Multi-Agent Synthesis** - Strategist, Analyst, and Critic agents collaborate in real-time
- **A2UI Protocol v1.1** - Stream glassmorphic UI components directly from LLM reasoning
- **What-If Simulations** - Model failure cascades and timeline risk propagation
- **Enterprise-Ready** - Direct GitHub Issues API v3 and Jira Cloud REST API integration
- **Premium UX** - Glassmorphic interface with Framer Motion 12 and Tailwind CSS 4.1

---

## 🗂️ The Multi-Agent Engine

Atlas facilitates **collaborative synthesis** between specialized AI agents. For detailed architecture and API documentation, see **[AGENT.md](./AGENT.md)**.

| Agent | Role | Output |
|-------|------|--------|
| **🎙️ The Strategist** | Decomposes "North Star" goals into Q1-Q4 2026 workstreams | Strategic milestones with dependencies |
| **🔬 The Analyst** | Performs feasibility scoring and TASK_BANK alignment | Risk assessments and capacity analysis |
| **⚖️ The Critic** | Stress-tests roadmaps for acyclic graph validation | DAG optimization and quality scores |

**Learn More**: Read the complete [Agent Development Kit documentation](./AGENT.md) for implementation details, API reference, and customization guides.

---

## ✨ Key Capabilities

| Feature | Description | Technology Stack |
|---------|-------------|------------------|
| **A2UI Protocol** | Real-time streaming of glassmorphic UI from LLM responses | React 19 + Framer Motion 12 |
| **What-If Simulation** | Failure cascade modeling with risk scoring | Custom dependency graph analysis |
| **Enterprise Sync** | Bidirectional sync with GitHub Issues and Jira tickets | REST API v3 + ADF formatting |
| **Glassmorphic UI** | Premium backdrop-blur design system | Tailwind CSS 4.1 + Lucide React |
| **Multi-Model AI** | Gemini 2.0 Flash with JSON schema enforcement | Google Generative AI SDK |
| **Persistent State** | Encrypted localStorage with Base64 obfuscation | Custom PersistenceService |
| **TaskBank** | 90+ pre-calculated 2026 strategic objectives | AI, Cyber, ESG, Global, Infra, People themes |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ or **yarn** 1.22+
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/gemini-api/docs/api-key))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/darshil0/atlas-strategic-agent.git
cd atlas-strategic-agent

# 2. Install dependencies
npm install

# 3. Environment Setup
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY

# 4. Launch Development Server
npm run dev
```

The application will be available at `http://localhost:3000` (configured in vite.config.ts).

---

## 🧪 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR at localhost:3000
npm run build            # Production build with type checking
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint with TypeScript rules
npm run format           # Format code with Prettier (80 char width)
npm run type-check       # TypeScript strict type checking

# Testing
npm test                 # Run test suite with Vitest
npm run test:ui          # Open Vitest UI dashboard
npm run coverage         # Generate coverage report (85% threshold)
```

### Code Quality Standards

- **TypeScript** - Strict mode with comprehensive type safety
- **ESLint** - Modern flat config with TypeScript integration; Zero Warning Baseline
- **Prettier** - Automated formatting (80 char width, 2 space tabs)
- **Vitest** - 85% coverage requirement across all metrics; 100% pass rate
- **React Testing Library** - Component integration tests

---

## 📂 Project Structure

```
atlas-strategic-agent/
├── src/
│   ├── components/              # React UI Components
│   │   ├── TaskCard.tsx         # Individual task display
│   │   ├── DependencyGraph.tsx  # ReactFlow visualization
│   │   ├── TimelineView.tsx     # Quarterly timeline
│   │   ├── TaskBank.tsx         # 90+ objective library
│   │   ├── SettingsModal.tsx    # GitHub/Jira configuration
│   │   ├── SettingsModal.tsx    # GitHub/Jira configuration
│   │   ├── Sidebar.tsx          # Navigation & View Switcher
│   │   └── a2ui/               # A2UI Protocol renderer
│   ├── config/                  # Centralized Configuration
│   │   ├── env.ts              # Environment validation
│   │   ├── system.ts           # ATLAS_SYSTEM_INSTRUCTION
│   │   └── ui.tsx              # Icon registry
│   ├── data/                    # Static Data & Templates
│   │   └── taskBank.ts         # 90+ 2026 objectives
│   ├── lib/
│   │   └── adk/                 # Agent Development Kit
│   │       ├── agents.ts       # Strategist/Analyst/Critic
│   │       ├── factory.ts      # Agent instantiation
│   │       ├── orchestrator.ts # MissionControl pipeline
│   │       ├── protocol.ts     # A2UI v1.1 protocol
│   │       ├── uiBuilder.ts    # Fluent UI builder
│   │       └── exporter.ts     # Mermaid/JSON export
│   │   └── utils.ts            # Centralized utilities (cn)
│   ├── services/                # External Services
│   │   ├── geminiService.ts    # Gemini 2.0 Flash integration
│   │   ├── githubService.ts    # GitHub Issues API v3
│   │   ├── jiraService.ts      # Jira Cloud REST API
│   │   ├── persistenceService.ts # Encrypted localStorage
│   │   └── index.ts            # Sync orchestration
│   ├── types/                   # TypeScript Definitions
│   │   └── index.ts            # Core type system
│   ├── test/                    # Test Infrastructure
│   │   ├── setup.ts            # Vitest configuration
│   │   └── smoke.test.ts       # Integration tests
│   ├── index.css                # Glassmorphic design system
│   ├── App.tsx                  # Main application entry
│   ├── index.tsx                # React 19 root renderer
│   └── global.d.ts              # Global type declarations
├── public/                      # Static Assets
├── docs/                        # Project Documentation
├── .env.example                 # Environment template
├── vite.config.ts               # Vite 7.3 configuration
├── vitest.config.ts             # Test configuration
├── tsconfig.json                # TypeScript compiler options
├── eslint.config.js             # ESLint flat config
├── postcss.config.cjs           # PostCSS + Tailwind
└── package.json                 # Dependencies and scripts
```

---

## 🛠️ Architecture Overview

```mermaid
graph TD
    A[Executive Input] --> B[MissionControl Orchestrator]
    B --> C{Agent Synthesis}
    C --> C1[Strategist Agent]
    C --> C2[Analyst Agent]
    C --> C3[Critic Agent]
    C1 & C2 & C3 --> D[A2UI Protocol v1.1]
    D --> E[Glassmorphic React UI]
    E --> F{Export Options}
    F --> F1[GitHub Issues API v3]
    F --> F2[Jira Cloud REST API]
    F --> F3[Mermaid Diagram]
    F --> F4[JSON Export]
```

---

## 🔧 Configuration

### Environment Variables

```env
# REQUIRED: Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OPTIONAL: GitHub Integration (configurable via Settings UI)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OPTIONAL: Jira Cloud Integration (configurable via Settings UI)
VITE_JIRA_DOMAIN=yourcompany.atlassian.net
VITE_JIRA_EMAIL=user@company.com
VITE_JIRA_TOKEN=ATATT3xxxxxxxxxxxxxxxxxxxxxxxxxxx

# OPTIONAL: Development
VITE_DEBUG_MODE=true
VITE_APP_VERSION=3.2.5
```

**Security Note**: GitHub and Jira credentials can be configured through the Settings modal in the UI. API keys are stored with Base64 obfuscation in localStorage. For production, use backend proxy endpoints.

---

## 🎨 Design System

Atlas uses a custom glassmorphic design system:

- **Glass-1**: `rgba(255, 255, 255, 0.1)` - Primary glass surfaces
- **Glass-2**: `rgba(255, 255, 255, 0.05)` - Secondary glass surfaces
- **Atlas Blue**: `#3b82f6` - Primary accent color
- **Atlas Indigo**: `#6366f1` - Secondary accent
- **Backdrop Blur**: 32px-64px for premium depth
- **Fonts**: Inter (sans), JetBrains Mono (mono), Outfit (display)

---

## 🗺️ Roadmap

### Completed ✅

- [x] **V3.2.7** - Zero-warning linting pipeline, 100% type safety across ADK & Services, and dependency modernization (React 19.2.4+).
- [x] **V3.2.6** - Hardened JSON parsing logic, multi-agent property mapping, and iterative refinement loops
- [x] **V3.2.4** - Multi-agent synthesis, A2UI protocol, ReactFlow graphs
- [x] **V3.2.4** - GitHub Issues and Jira Cloud synchronization
- [x] **V3.2.4** - TaskBank with 90+ 2026 strategic objectives
- [x] **V3.2.4** - What-If failure simulation engine
- [x] **V3.2.4** - Glassmorphic UI with Framer Motion animations

### Planned 🚀

- [ ] **V4.0.0** - Monte Carlo risk modeling with probability distributions
- [ ] **V4.1.0** - Real-time collaboration via WebSockets
- [ ] **V4.2.0** - Resource optimizer (headcount/budget allocation)
- [ ] **V4.3.0** - Claude Code integration for agentic coding tasks

---

## 🧪 Testing

Atlas maintains 85% test coverage across all metrics:

```bash
# Run tests with coverage
npm run coverage

# Watch mode for development
npm test

# Open Vitest UI
npm run test:ui
```

### Test Coverage Requirements

- **Lines**: 85%
- **Functions**: 85%
- **Branches**: 85%
- **Statements**: 85%

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run quality checks: `npm run lint && npm test`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📚 Documentation

- **[Agent Development Kit (ADK)](./AGENT.md)** - Multi-agent architecture and API reference
- **[Technical Deep Dive](./docs/technical-deep-dive.md)** - Detailed engineering blog post and architectural decisions
- [Changelog](./CHANGELOG.md) - Version history and release notes
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs) - Gemini 2.0 Flash docs

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google AI** - For the Gemini 2.0 Flash model and Generative AI SDK
- **Vercel** - For React 19 and the Next.js ecosystem
- **Tailwind Labs** - For Tailwind CSS 4.1
- **XYFlow Team** - For @xyflow/react dependency visualization
- **Framer** - For Framer Motion animation library

---

## 👨‍💻 Author

**Darshil Shah**  
*QA Engineering Leader & AI Architect*

- 🔗 [LinkedIn](https://linkedin.com/in/darshil-qa-lead)
- 🐙 [GitHub](https://github.com/darshil0)
- 🐦 [X (Twitter)](https://x.com/soulsurfer300)
- 📧 [Email](mailto:contact@darshilshah.com)

---

<div align="center">

**Built with ❤️ by Darshil Shah**

*Transforming executive vision into executable reality*

[Report Bug](https://github.com/darshil0/atlas-strategic-agent/issues) · [Request Feature](https://github.com/darshil0/atlas-strategic-agent/issues) · [Documentation](https://github.com/darshil0/atlas-strategic-agent/wiki)

</div>

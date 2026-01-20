# 🌌 Atlas Strategic Agent V3.2.0

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-Optimized-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-Coverage%2080%25-6E9F18?style=for-the-badge&logo=vitest)

### *Executive Vision → Executable Enterprise Roadmaps*

**Atlas** is a multi-model AI agent that bridges the gap between high-level executive intent and granular project execution. Powered by **Gemini 2.0 Flash**, it utilizes a multi-agent "Mission Control" architecture to generate dynamic, glassmorphic strategic roadmaps with native Jira and GitHub synchronization.

---

## 🎯 What Makes Atlas Different?

Atlas offers several key differentiators that set it apart from traditional project management tools. The platform features a multi-agent synthesis approach where Strategist, Analyst, and Critic agents collaborate in real-time to generate comprehensive roadmaps. Through the A2UI Protocol, it streams UI components directly from LLM reasoning, creating a seamless experience. The what-if simulation capability allows you to model failure cascades and timeline impacts before they occur. Enterprise-ready features include direct GitHub Issues and Jira Cloud integration for immediate task synchronization. Finally, the premium glassmorphic interface is specifically designed for executive presentations, ensuring your strategic plans look as polished as they are actionable.

---

## 🗂️ The Multi-Agent Engine

Atlas doesn't just generate text; it facilitates a **collaborative synthesis** between specialized AI agents:

| Agent | Role | Output |
|-------|------|--------|
| **🎙️ The Strategist** | Decomposes "North Star" goals into high-level workstreams | Strategic milestones |
| **🔬 The Analyst** | Performs feasibility scoring and data validation | Risk assessments |
| **⚖️ The Critic** | Stress-tests the roadmap for risks and dependencies | Optimizations |

---

## ✨ Key Capabilities

Atlas provides a comprehensive suite of features designed for enterprise strategic planning. The A2UI Protocol enables real-time streaming of UI components directly from LLM reasoning using React 19 and Framer Motion, creating a fluid and responsive experience. What-If Simulation allows you to model failure cascades and see how delays impact deadlines through XYFlow and custom logic. Enterprise Sync capabilities let you bulk-export tasks directly to GitHub Issues or Jira Cloud using REST API v3, eliminating manual data entry. The Glassmorphic UI delivers a premium, high-performance interface built with Tailwind and Lucide, perfect for executive presentations. Multi-Model Support leverages Gemini 2.0 Flash with JSON schema enforcement through Google Generative AI for reliable outputs. Finally, Persistent State management uses IndexedDB and localStorage with Base64 obfuscation for local caching.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed: Node.js version 20 or higher (LTS recommended), npm version 10 or higher (or yarn 1.22+), and a Google Gemini API Key which you can obtain from the Google AI Studio.

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

The application will be available at `http://localhost:3000`.

---

## 🧪 Development Workflow

### Available Scripts

The following scripts are available to streamline your development workflow. For development tasks, use `npm run dev` to start the dev server with HMR, `npm run build` for production builds with type checking, and `npm run preview` to preview the production build locally. Code quality tools include `npm run lint` to run ESLint with strict TypeScript checks, `npm run format` for code formatting with Prettier, and `npm run type-check` for TypeScript type checking without emit. Testing capabilities are accessed through `npm test` to run the test suite in watch mode, `npm run test:ui` to open the Vitest UI, and `npm run coverage` to generate coverage reports with the 80% threshold requirement.

### Code Quality Standards

The project maintains high code quality through several enforced standards. TypeScript is configured in strict mode with comprehensive type safety across the entire codebase. ESLint uses a custom configuration with TypeScript-specific rules to catch potential issues early. Prettier handles automated code formatting with an 80 character width limit for consistency. Vitest enforces an 80% coverage requirement across all metrics including lines, functions, branches, and statements.

---

## 📂 Project Structure

```text
atlas-strategic-agent/
├── src/
│   ├── components/              # React UI Components
│   │   ├── TaskCard.tsx         # Individual task visualization
│   │   ├── DependencyGraph.tsx  # XYFlow dependency viewer
│   │   └── SettingsModal.tsx    # API key management
│   ├── config/                  # Centralized Configuration
│   │   ├── env.ts               # Environment validation
│   │   └── prompts.ts           # System prompts for agents
│   ├── lib/
│   │   └── adk/                 # Agent Development Kit
│   │       ├── agents/          # Agent implementations
│   │       ├── factory.ts       # Agent factory pattern
│   │       └── protocol.ts      # A2UI protocol parser
│   ├── services/                # External Services
│   │   ├── gemini.service.ts    # LLM integration
│   │   ├── github.service.ts    # GitHub API v3
│   │   ├── jira.service.ts      # Jira REST API
│   │   └── storage.service.ts   # Persistence layer
│   ├── types/                   # TypeScript Definitions
│   │   ├── plan.types.ts        # Core data models
│   │   └── agent.types.ts       # Agent interfaces
│   ├── test/                    # Test Infrastructure
│   │   └── setup.ts             # Vitest global setup
│   ├── index.css                # Global Styles + Tailwind
│   ├── App.tsx                  # Main Application Entry
│   └── main.tsx                 # React 19 root renderer
├── public/                      # Static Assets
├── .env.example                 # Environment variable template
├── vite.config.ts               # Vite build configuration
├── vitest.config.ts             # Test configuration
├── tsconfig.json                # TypeScript compiler options
├── tailwind.config.ts           # Tailwind CSS customization
├── eslint.config.js             # ESLint rules
└── package.json                 # Dependencies and scripts
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Enterprise Integrations
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
VITE_JIRA_DOMAIN=your-company.atlassian.net
VITE_JIRA_EMAIL=your-email@company.com
VITE_JIRA_API_TOKEN=your_jira_token

# Optional: Application Settings
VITE_DEBUG_MODE=false
VITE_DEFAULT_MODEL=gemini-2.0-flash-exp
VITE_MAX_TOKENS=8000
```

### API Key Security

**Important Security Notice**: API keys are stored in browser localStorage with Base64 obfuscation for convenience, not true secrecy. For production deployments, you should route all LLM and integration calls through a backend or edge proxy and keep secrets server-side to ensure proper security.

---

## 🧪 Testing Strategy

Atlas includes a comprehensive test suite with an **80% coverage requirement**:

```bash
# Run tests in watch mode
npm test

# Generate coverage report
npm run coverage

# Open interactive test UI
npm run test:ui
```

### Test Structure

The test suite is organized alongside the source code for easy maintenance. Components like TaskCard.tsx have corresponding TaskCard.test.tsx files for component testing. Services such as gemini.service.ts include gemini.service.test.ts files for service-level testing. The Agent Development Kit includes tests for agent logic, with files like strategist.test.ts testing the strategist agent implementation.

### Coverage Thresholds

All coverage metrics must meet or exceed 80% across the following categories: lines, functions, branches, and statements.

---

## 🛠️ Project Architecture

The architecture follows a clear flow from executive input through the Mission Control Orchestrator, which coordinates Agent Synthesis across the Strategist Agent, Analyst Agent, and Critic Agent. These agents feed into the A2UI Protocol Parser, which renders the Glassmorphic React UI. From there, users can export to various formats including GitHub Issues API v3, Jira Cloud REST API, Mermaid diagrams, or JSON export.

### Core Technologies

The frontend is built with React 19 utilizing concurrent features for optimal performance. The build process uses Vite 6.0 with esbuild for fast compilation. Styling is handled through Tailwind CSS with local compilation for zero runtime overhead. State management combines React Context with localStorage for persistence. The AI provider is Google Gemini 2.0 Flash, which powers the multi-agent system. Visualization uses XYFlow (React Flow) for dependency graphs, while animations are handled by Framer Motion 12. Testing infrastructure uses Vitest with Testing Library for comprehensive coverage. Type safety is enforced through TypeScript 5.7 running in strict mode.

---

## 🔒 Security & Performance

### Security Measures

Security is implemented through multiple layers. API Key Management uses local obfuscation with a recommended backend proxy for production deployments. Type Safety is enforced through strict TypeScript across the entire codebase. Input Validation includes runtime schema validation for LLM outputs to prevent malformed data. XSS Prevention leverages React's built-in escaping plus CSP headers. Dependency Scanning is performed regularly through npm audit checks to identify and address vulnerabilities.

### Performance Optimizations

Performance has been optimized across multiple dimensions. The bundle size is approximately 1.5MB when gzipped after recent optimizations. Code splitting uses dynamic imports for vendor chunks to reduce initial load time. Tree shaking through Vite's dead code elimination removes unused code. The local CSS pipeline uses PostCSS with no CDN dependency for faster loading. React 19's concurrent rendering enables smooth animations without blocking the UI.

---

## 🗺️ Roadmap

### Completed

Recent releases have delivered significant capabilities. Version 3.2.1 introduced test infrastructure with coverage thresholds. Version 3.2.0 added enterprise sync for GitHub and Jira along with ADK enhancements. Version 3.1.6 focused on codebase hygiene with dead code removal. Version 3.1.5 delivered a performance overhaul including local CSS and bundle optimization. Version 3.1.4 implemented runtime hardening with safe JSON parsing and environment validation. Version 3.1.3 established the multi-agent synthesis architecture. Version 3.1.0 added dependency visualization with XYFlow. Version 3.0.0 laid the foundation with Glassmorphism 2.0.

### Planned

Future releases will continue to expand capabilities. Version 4.0.0 will introduce real-time collaboration through WebSockets with collaborative editing features. Version 3.3.0 will add Monte Carlo risk modeling for more sophisticated analysis. Upcoming 3.2.x releases will include a resource optimizer for headcount and budget allocation, Slack and Teams integration for alerts, and advanced executive reporting with PDF exports.

---

## 📚 Documentation

Additional documentation is available in the repository. The Changelog provides version history and release notes. The Contributing Guide explains how to contribute to the project. API Documentation covers the service layer in detail. The ADK Guide provides information on the Agent Development Kit. The Deployment Guide offers instructions for production deployment.

---

## 🤝 Contributing

We welcome contributions from the community. To contribute, start by forking the repository and creating a feature branch. Run the test suite to ensure everything works correctly. Commit your changes with clear, descriptive messages. Push to your feature branch and open a Pull Request with a detailed description of your changes.

### Contribution Guidelines

Contributors should follow the existing code style enforced by Prettier and ESLint. All new features must include tests that maintain the 80% coverage requirement. Documentation should be updated as needed to reflect changes. All CI checks must pass before a pull request can be merged.

---

## 📄 License

This project is part of the **Advanced Agentic Coding** initiative.

---

## 🙏 Acknowledgments

This project builds on the excellent work of several organizations and teams. Google AI provides the Gemini 2.0 Flash model that powers the multi-agent system. Vercel maintains the React ecosystem that forms the foundation of the UI. Tailwind Labs created Tailwind CSS, which enables the efficient styling system. The XYFlow Team developed the dependency visualization library that makes complex relationships clear.

---

## 👨‍💻 Author

**Darshil Shah**  
*QA Engineering Leader & AI Architect*

Connect with me through LinkedIn, GitHub, X (Twitter), or email for questions, feedback, or collaboration opportunities.

---

## ⭐ Star History

If you find Atlas useful, please consider giving it a star on GitHub!

---

## 📊 Stats

Project statistics and badges are available on the GitHub repository including stars, forks, open issues, and license information.

---

<div align="center">

**Built with ❤️ by Darshil**

*Transforming executive vision into executable reality*

[Report Bug](https://github.com/darshil0/atlas-strategic-agent/issues) · [Request Feature](https://github.com/darshil0/atlas-strategic-agent/issues) · [Documentation](https://github.com/darshil0/atlas-strategic-agent/wiki)

</div>

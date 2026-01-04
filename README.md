# Atlas Strategic Agent 🗺️

**Breaking down mountains into manageable stones**

[![Google AI Studio](https://img.shields.io/badge/Google-AI_Studio-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.studio)
[![Gemini API](https://img.shields.io/badge/Gemini-API-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-Visualizer-FF385C?style=for-the-badge)](https://reactflow.dev/)

</div>

---

## 🌟 Overview

**Atlas** is a world-class autonomous task decomposition and execution engine powered by the Google Gemini API. It transforms complex, long-term goals into structured, multi-year roadmaps with visual dependency graphing and real-time execution tracking.

Designed for **methodical thoroughness** and **adaptive planning**, Atlas specializes in breaking down ambitious projects into actionable subtasks, executing them systematically, and learning from every interaction.

### ✨ Key Features

- 🧩 **Intelligent Task Decomposition** - Automatically breaks complex goals into structured subtasks
- 📊 **Visual Dependency Graphs** - Interactive React Flow diagrams showing task relationships
- ⚡ **Real-Time Execution Tracking** - Monitor progress as Atlas works through your roadmap
- 🎯 **Multi-Year Planning** - Handle long-term strategic goals with milestone tracking
- 🧠 **Adaptive Learning** - Improves strategies based on outcomes and patterns
- 🔄 **Dynamic Replanning** - Adjusts approach when obstacles arise
- 📈 **Progress Visualization** - Clear status indicators for every subtask
- 🛠️ **Google Gemini Powered** - Leverages cutting-edge AI for intelligent decision-making

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Google Gemini API Key** - Get yours at [Google AI Studio](https://ai.studio)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/darshil0/atlas-strategic-agent.git
cd atlas-strategic-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your API key**

Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the application**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

---

## 📚 How It Works

### The Atlas Process

```
User Goal → Task Decomposition → Dependency Analysis → Visual Planning → Execution → Learning
```

#### 1️⃣ **Understanding Phase**
Atlas analyzes your complex goal, identifies requirements, and asks clarifying questions to ensure complete understanding.

#### 2️⃣ **Planning Phase**
- Breaks the goal into hierarchical subtasks
- Identifies dependencies between tasks
- Creates a visual dependency graph using React Flow
- Estimates timeline and resources

#### 3️⃣ **Execution Phase**
- Works through subtasks systematically
- Provides real-time progress updates
- Adapts to obstacles and changes
- Validates outputs at each step

#### 4️⃣ **Learning Phase**
- Analyzes what worked and what didn't
- Stores successful patterns
- Refines future decomposition strategies
- Builds domain expertise over time

---

## 🎯 Use Cases

### Strategic Planning
```
"Create a 3-year product roadmap for an AI startup"
```
Atlas decomposes this into market research, competitive analysis, feature planning, milestone definitions, resource allocation, and risk assessment.

### Research Projects
```
"Research renewable energy trends and compile a comprehensive report"
```
Atlas searches multiple sources, analyzes data, synthesizes findings, and produces a structured document with citations.

### Complex Development
```
"Build a full-stack application with authentication, database, and API"
```
Atlas breaks this into frontend components, backend services, database schema, API endpoints, testing, and deployment steps.

### Business Operations
```
"Plan and execute a company-wide digital transformation"
```
Atlas creates a multi-year strategy with stakeholder management, technology selection, implementation phases, and success metrics.

---

## 🏗️ Architecture

```
atlas-strategic-agent/
├── components/           # React UI components
│   ├── TaskGraph.tsx    # React Flow visualization
│   ├── StatusPanel.tsx  # Progress tracking
│   └── ChatInterface.tsx # User interaction
├── services/            # Core services
│   ├── gemini.ts        # Gemini API integration
│   ├── taskEngine.ts    # Decomposition logic
│   └── stateManager.ts  # State persistence
├── types.ts             # TypeScript definitions
├── App.tsx              # Main application
├── agents_md_spec.md    # Agent configuration
└── package.json         # Dependencies
```

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Visualization**: React Flow for dependency graphs
- **AI Engine**: Google Gemini API (gemini-2.0-flash-exp)
- **Build Tool**: Vite
- **State Management**: React hooks + custom state manager
- **Styling**: Tailwind CSS

---

## 🧠 Agent Configuration

Atlas uses a comprehensive system instruction file (`agents_md_spec.md`) that defines its:

- Core identity and personality
- Task decomposition methodology
- Execution protocols
- Learning mechanisms
- Error handling strategies
- Communication guidelines

The agent operates with these behavioral traits:
- **Thoroughness**: 90%
- **Creativity**: 70%
- **Efficiency**: 80%
- **Caution**: 60%

---

## 🎨 Visual Features

### Interactive Dependency Graph

Atlas generates beautiful, interactive graphs showing:
- Task nodes with status indicators
- Dependency relationships
- Critical path highlighting
- Real-time progress updates
- Zoom and pan controls
- Node grouping by phase

### Progress Dashboard

Monitor execution with:
- Overall completion percentage
- Active tasks in progress
- Completed milestones
- Blocked items requiring attention
- Timeline visualization
- Resource allocation views

---

## 🔧 Configuration

### Gemini Model Settings

```typescript
{
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192
}
```

### Agent Behavior Customization

Modify behavioral traits in `agents_md_spec.md`:
- Adjust thoroughness for faster vs. more detailed planning
- Increase creativity for innovative solutions
- Tune efficiency for time-sensitive projects
- Set caution level based on risk tolerance

---

## 📖 Example Interactions

### Simple Task
```
User: "Plan my weekend trip to San Francisco"

Atlas:
├─ Research top attractions
├─ Check weather forecast
├─ Book accommodations
├─ Plan daily itinerary
├─ Identify restaurants
└─ Create packing list
```

### Complex Project
```
User: "Launch an e-commerce platform in 6 months"

Atlas:
├─ Phase 1: Planning & Research (Month 1)
│   ├─ Market research
│   ├─ Competitor analysis
│   ├─ Technology stack selection
│   └─ Resource planning
├─ Phase 2: Design (Month 2)
│   ├─ UX/UI design
│   ├─ Database schema
│   └─ API architecture
├─ Phase 3: Development (Months 3-4)
│   ├─ Frontend development
│   ├─ Backend services
│   ├─ Payment integration
│   └─ Testing
├─ Phase 4: Testing & QA (Month 5)
└─ Phase 5: Launch (Month 6)
```

---

## 🛠️ Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow TypeScript best practices
2. Maintain comprehensive type definitions
3. Write clear commit messages
4. Update documentation for new features
5. Add tests for core functionality

---

## 📝 License

This project is generated from the [Google AI Studio repository template](https://github.com/google-gemini/aistudio-repository-template).

---

## 🔗 Links

- **View in AI Studio**: [Open App](https://ai.studio/apps/drive/1UgGhL2ni0OTp0MrtNsKaiWM2RAP7EdPC)
- **Gemini API Docs**: [Google AI for Developers](https://ai.google.dev/)
- **React Flow Docs**: [reactflow.dev](https://reactflow.dev/)
- **Report Issues**: [GitHub Issues](https://github.com/darshil0/atlas-strategic-agent/issues)

---

## 🙏 Acknowledgments

- Built with [Google Gemini API](https://ai.google.dev/)
- Powered by [React Flow](https://reactflow.dev/)
- Inspired by strategic planning methodologies and autonomous agent research

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please open an issue or reach out through GitHub.

---

<div align="center">

**Atlas Strategic Agent** - Transforming complexity into clarity, one task at a time.

***Made with ❤️ by Darshil using Google Gemini API***

</div>

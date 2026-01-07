# Atlas Strategic Agent V2.0

![Atlas Strategic](https://img.shields.io/badge/Atlas-Strategic_v2.0-blue?style=for-the-badge&logo=google-gemini)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Atlas Strategic** is a powerful, multi-agent strategic engine designed to decompose complex objectives into actionable, structured roadmaps. Evolved from a simple task-list into a persistent, collaborative, and highly interactive strategic environment.

## 🚀 Key Features (v2.0)

### 🧠 Multi-Agent Orchestration
Powered by specialized AI personas working in coordination:
- **Strategist**: Architects roadmap structure and logical decomposition.
- **Analyst**: Reviews data grounding and ensures technical feasibility.
- **Critic**: Automated risk assessment and constraint validation.

### 🌐 Interactive Strategy Graph
Visual design meets tactical execution:
- **Recursive Decomposition ("Explode")**: Directly break down high-level nodes into sub-plans.
- **Dynamic Dependency Linking**: Draw connections between nodes to define strategic prerequisites.
- **Reactive State Flow**: Real-time visualization of task progress across the network.

### 🍱 Advanced A2UI Component Library
Native rendering of agent-generated UI components including:
- **Analytical Charts**: Visual feedback on metrics and feasibility.
- **Interactive Forms**: Selects, checkboxes, and inputs for parameter-driven strategy.
- **Context Grounding**: Dedicated section for injecting URLs and technical snippets.

### ✨ Premium Aesthetics
- **Glassmorphism UI**: High-end transparency and blur effects.
- **Modern Typography**: High-impact "Outfit" display font and "Inter" body text.
- **Micro-interactions**: Shimmer effects, smooth transitions, and reactive hover states.

## 🛠️ Technology Stack
- **Core**: React 18, TypeScript, Vite
- **AI**: Google Gemini 1.5 Flash (via `@google/genai`)
- **Graphing**: React Flow
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Persistence**: LocalState Hydration Service

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/darshil0/atlas-strategic-agent.git
   cd atlas-strategic-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Application**
   ```bash
   npm run dev
   ```

## 📖 Version History

- **v2.0.0**: Premium UI overhaul, Multi-agent orchestration, "Explode" recursive breakdown, and Context Grounding.
- **v1.5.0**: Persistence integration and Graph interactivity.
- **v1.0.0**: Initial release with Gemini strategy synthesis.

## 📄 License
This project is licensed under the MIT License.

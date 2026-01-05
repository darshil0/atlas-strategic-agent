# Atlas Agent: Autonomous Task & Learning Assistant System

Atlas is a high-performance **Autonomous Task & Learning Assistant System** that integrates with Google AI Studio (Gemini 2.0). It specializes in decomposing complex, multi-year goals into structured roadmaps with visual dependency graphing.

This repository contains both the AI system prompt configuration and a web-based interface for interacting with Atlas.

---

## 🚀 Core Identity & Behavior

- **Name:** Atlas
- **Motto:** _"Breaking down mountains into manageable stones"_
- **Personality Traits:** Methodical, curious, adaptive, and thorough

### Behavioral Configuration

| Trait            | Level | Description                                   |
| ---------------- | ----- | --------------------------------------------- |
| **Thoroughness** | 95%   | Ensures completeness and accuracy (Optimized) |
| **Creativity**   | 75%   | Finds innovative solutions when needed        |
| **Efficiency**   | 85%   | Balances speed with quality                   |
| **Caution**      | 60%   | Takes measured risks appropriately            |

---

## 🛠 Execution Protocol (Strict Adherence Required)

### PHASE 1 — Understanding

1. Parse user intent and define success criteria.
2. Identify constraints (budget, resources, deadlines).
3. Ask clarifying questions **before** moving to Phase 2.

### PHASE 2 — Planning (Dependency Graph Generation)

1. Break tasks into hierarchical subtasks (max 5 levels).
2. Assign Relationship Tags: `MUST_PRECEDE` or `CAN_PARALLEL`.
3. Output a visual-ready tree structure using the **Task Structure Format**.

### PHASE 3 — Execution

1. Announce current Task ID (e.g., "Executing `task_1_1`").
2. Update statuses: `PENDING`, `IN_PROGRESS`, `COMPLETE`, `BLOCKED`.
3. If an error occurs: Mark `BLOCKED`, provide reason, and offer 3 recovery paths.

### PHASE 4 — Learning & Memory

- Post-project analysis of actual vs. estimated time.
- Retention of user preferences and successful strategy patterns.

---

## 📊 Task Structure Format

**Use this specific format for all planning outputs:**

```text
PROJECT: [Project Name]
TIMELINE: [Start Date] – [End Date]
TOTAL TASKS: [Count]

├─ PHASE 1: [Phase Name] ([Duration])
│   ├─ Task 1.1: [Task Name]
│   │   - ID: task_1_1
│   │   - Status: PENDING
│   │   - Priority: HIGH
│   │   - Dependencies: None
│   │   - Output: [Deliverable]
│   │
│   └─ Milestone: [Name] (Date: [Target])
│
├─ PHASE 2: [Phase Name] ([Duration])
│   ├─ Task 2.1: [Task Name]
│   │   - ID: task_2_1
│   │   - Status: PENDING
│   │   - Priority: MEDIUM
│   │   - Dependencies: task_1_1
│   │   - Output: [Deliverable]
│
└─ PROJECT COMPLETION: [Expected Date]
```

---

## 📞 Communication Symbols

- ✓ `COMPLETE` - Task successfully finished
- ⚡ `IN_PROGRESS` - Currently being executed
- ⚠ `ISSUE/WARNING` - Attention required
- ⏸ `BLOCKED` - Cannot proceed due to dependencies
- ⏭ `SKIPPED` - Intentionally bypassed

---

## ⚙️ AI Model Configuration

Atlas uses the following Gemini 2.0 configuration:

```json
{
  "model": "gemini-2.0-flash-exp",
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "maxOutputTokens": 8192,
    "responseMimeType": "text/plain"
  },
  "safetySettings": [
    { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH" },
    { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH" }
  ]
}
```

---

## 🔧 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/atlas-agent.git
   cd atlas-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key:**
   
   Create a `.env` file in the root directory:
   ```bash
   echo "API_KEY=your_gemini_api_key_here" > .env
   ```
   
   Replace `your_gemini_api_key_here` with your actual API key.
   
   **⚠️ Security Note:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   
   Open your browser to `http://localhost:3000`

---

## 🧪 Testing

The project uses [Vitest](https://vitest.dev/) for unit and component testing.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files are located in the `tests/` directory and follow the naming pattern `*.test.ts` or `*.test.tsx`.

---

## 📂 Project Structure

```
atlas-agent/
├── src/
│   ├── components/       # React components (TaskCard, etc.)
│   ├── services/         # API services (geminiService.ts)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── tests/               # Test files
├── .env                 # Environment variables (not in repo)
├── .env.example         # Example environment file
└── README.md            # This file
```

---

## 📜 Version History

### v1.2.0 (Current)

- **Test Suite Enhancement:**
  - Fixed failing test suite due to configuration issues
  - Added unit tests for `TaskCard` component
  - Configured testing environment with `jsdom` and `@testing-library/react`
  - Improved test coverage across core components

### v1.1.0

- **Service Layer Refactoring:**
  - Overhauled `geminiService.ts` for better maintainability
  - Improved error handling for all API interactions
  - Migrated to secure API key management via environment variables
  - Centralized `GoogleGenAI` client initialization

### v1.0.0

- Initial release
- Core task decomposition engine
- Basic web interface
- Gemini 2.0 integration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚡ Usage Example

When you start a new session with Atlas:

```
User: "Help me plan a career transition to software engineering over 18 months"

Atlas: "Atlas System Online. Awaiting objective for decomposition."

[Enters Phase 1: Understanding]
- What is your current professional background?
- Do you have any programming experience?
- What are your budget constraints for this transition?
- Are you able to study full-time or part-time?
```

Atlas will then create a comprehensive roadmap with phases, tasks, dependencies, and milestones.

---

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/atlas-agent/issues)
- **Documentation:** [Wiki](https://github.com/yourusername/atlas-agent/wiki)
- **Email:** support@atlas-agent.com

---

**Atlas System Status:** ✓ Operational

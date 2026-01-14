# Atlas Strategic Agent

**Atlas** transforms executive vision into executable enterprise roadmaps through multi-agent collaborative intelligence and a premium glassmorphic interface.

---

## 🎯 Executive Summary

**Traditional PM = Reactive** → **Atlas = Proactive Strategic Intelligence**

Atlas bridges high-level goals to actionable roadmaps using:
- **Multi-Agent Core** (Strategist + Analyst + Critic)  
- **A2UI Protocol** (Native agent UI generation)
- **Google Gemini 2.0 Flash** (Structured JSON reasoning)
- **Live Dependency Graph** + **What-If Simulation**

---

## 🧠 Architecture Overview

```
Executive Intent → MissionControl → Multi-Agent Synthesis → Strategic Roadmap
                           ↓
                 A2UI Protocol → Glassmorphic React Interface
                           ↓
           GitHub/Jira Export + Mermaid Visualization
```

**Agent Trio**:
```
Strategist → Goal decomposition + roadmap generation
Analyst   → Feasibility scoring + data validation  
Critic    → Risk analysis + optimization suggestions
```

---

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/darshil0/atlas-strategic-agent
cd atlas-strategic-agent
npm ci

# Configure (create .env)
echo "VITE_GEMINI_API_KEY=your_gemini_key_here" > .env

# Development
npm run dev
```

**Example Goals**:
```
"Launch APAC HQ Q2 2026"
"Net-zero certification FY2026" 
"6G infrastructure migration"
"4-day workweek rollout"
```

---

## ✨ Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Multi-Agent** | ✅ Live | Strategist/Analyst/Critic collaboration |
| **Live Graph** | ✅ Interactive | XYFlow dependency visualization |
| **What-If** | ✅ Real-time | Failure cascade simulation |
| **A2UI** | ✅ Streaming | Native agent UI from LLM |
| **GitHub** | ✅ Production | Issue creation + bulk sync |
| **Jira** | ✅ Production | Rich ADF tickets + workflows |
| **Export** | ✅ Mermaid/JSON | Copy-paste ready diagrams |
| **TaskBank** | ✅ 90 Tasks | Pre-loaded 2026 strategic objectives |

---

## 🛠 Tech Stack

**Frontend**: React 19 + Vite + TypeScript (strict) + TailwindCSS 3.4 + Framer Motion  
**AI/LLM**: Google Gemini 2.0 Flash Experimental (JSON Schema)  
**ADK**: Custom Agent Development Kit (A2UI Protocol)  
**Visualization**: XYFlow (dependency graphs) + Mermaid (diagrams)  
**Persistence**: Secure localStorage + API key encoding  
**Integrations**: GitHub Issues API v3 + Jira Cloud REST v3  
**Testing**: Vitest + React Testing Library  
**Build**: PostCSS + Local TailwindCSS compilation

---

## 📱 User Experience

1. **Input Goal** → "Establish Singapore APAC HQ Q2 2026"
2. **Multi-Agent Synthesis** → Strategist/Analyst/Critic collaborate in real-time
3. **Visual Roadmap** → Interactive dependency graph + timeline views  
4. **Risk Simulation** → What-if failure analysis with cascade impact
5. **Export** → GitHub Issues / Jira Tickets / Mermaid diagrams

---

## 🔧 Configuration

**.env** (required):
```env
VITE_GEMINI_API_KEY=AIzaSy...your_key_here
```

**GitHub/Jira** (optional, via Settings UI):
```
GitHub: owner/repo + Personal Access Token (repo scope)
Jira: domain.atlassian.net + API Token + email
```

**Environment Variables**:
- `VITE_GEMINI_API_KEY` - Google Gemini API key (required)
- `ENV.DEBUG_MODE` - Enable structured logging (optional)

---

## 🧪 Development

```bash
npm run dev      # Development server (http://localhost:5173)
npm run build    # Production build  
npm run preview  # Production preview
npm test         # Vitest + React Testing Library
npm run lint     # ESLint + Prettier
npm run type     # Strict TypeScript checking
```

**Project Structure**:
```
src/
├── lib/adk/              # Agent Development Kit
│   ├── factory.ts        # Agent factory with exhaustive typing
│   ├── orchestrator.ts   # MissionControl multi-agent coordinator
│   ├── agents/           # Strategist/Analyst/Critic implementations
│   ├── protocol.ts       # A2UI v1.0 specification
│   └── uiBuilder.ts      # Fluent A2UI component builder
├── services/
│   ├── atlasService.ts   # Gemini API abstraction
│   ├── githubService.ts  # GitHub Issues integration
│   └── jiraService.ts    # Jira Cloud REST API integration
├── components/           # React UI components
└── config/
    └── env.ts           # Environment validation
```

---

## 📂 Production Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Static Hosting
```bash
npm run build && npx serve dist
```

**Environment Variables**: Configure `VITE_GEMINI_API_KEY` in your hosting platform's environment settings.

---

## 🎨 Design System

**Glassmorphism 2.0**:
- `backdrop-blur-3xl` + `slate-950/20` layering
- Gradient borders (`blue-500/20` → `slate-800/50`)  
- Micro-animations (Framer Motion layout transitions)
- Tailwind local CSS build (zero runtime overhead)
- Premium typography (Inter font family)

**Performance Optimizations**:
- 45% bundle reduction (2.8MB → 1.5MB gzipped)
- Local PostCSS compilation
- Virtualized graph rendering
- Lazy component loading

---

## 🔒 Security Notes

⚠️ **Browser API Keys**: localStorage encoded (btoa) but visible to dev tools

- ✅ API keys auto-obfuscated
- ✅ .env → Vite client-side only (VITE_* prefix)
- ⚠️ Production: Use backend proxy endpoints for API key management
- ✅ Runtime validation + error boundaries
- ✅ Secure HTTPS-only deployment recommended

**Best Practices**:
- Never commit `.env` files to version control
- Use backend proxy for production API calls
- Rotate API keys regularly
- Implement rate limiting on backend

---

## 📈 Roadmap

**Completed**:
- ✅ **v3.2.0** - GitHub/Jira Integration + Bulk Sync
- ✅ **v3.1.5** - Performance (Local CSS + Virtualized Graph)
- ✅ **v3.1.4** - A2UI Streaming + JSON Schema Enforcement  
- ✅ **v3.1.3** - Multi-Agent ADK Decoupling
- ✅ **v3.1.0** - Core Features (TaskBank, DependencyGraph, What-If)
- ✅ **v3.0.0** - Project Foundation (React 19 + Glassmorphic UI)

**Upcoming v4.0.0**:
- ⏳ WebSocket multi-user collaboration
- ⏳ Monte Carlo risk simulation
- ⏳ Resource allocation optimizer
- ⏳ Slack/Teams notifications
- ⏳ Puppeteer PDF export

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- TypeScript strict mode compliance
- ESLint/Prettier formatting
- Test coverage for new features
- Documentation updates

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Advanced Agentic Coding Initiative. Commercial use permitted with attribution.

---

## 👨‍💻 Author

**Darshil Shah**  
QA Engineering Leader & AI Architect

- **GitHub**: [@darshil0](https://github.com/darshil0)
- **LinkedIn**: [linkedin.com/in/darshil-qa-lead](https://linkedin.com/in/darshil-qa-lead)
- **X/Twitter**: [@soulsurfer300](https://x.com/soulsurfer300)
- **Email**: darshils99@gmail.com
- **Location**: Dallas/Irving, TX

*Transforming healthcare quality through AI-driven engineering*

---

## 🔗 Links & Resources

- **Live Demo**: [Coming Soon]
- **GitHub Repository**: [darshil0/atlas-strategic-agent](https://github.com/darshil0/atlas-strategic-agent)  
- **Issues**: [GitHub Issues](https://github.com/darshil0/atlas-strategic-agent/issues)  
- **Documentation**: Inline architecture diagrams + TypeScript docs
- **API Documentation**: [Google Gemini Docs](https://ai.google.dev/gemini-api/docs)

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [XYFlow](https://reactflow.dev/) - Graph visualization

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/darshil0/atlas-strategic-agent?style=social)
![GitHub forks](https://img.shields.io/github/forks/darshil0/atlas-strategic-agent?style=social)
![GitHub issues](https://img.shields.io/github/issues/darshil0/atlas-strategic-agent)
![GitHub license](https://img.shields.io/github/license/darshil0/atlas-strategic-agent)

---

*Transforming executive vision into executable reality.*

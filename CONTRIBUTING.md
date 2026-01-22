# 🤝 Contributing to Atlas Strategic Agent

Thank you for your interest in contributing to Atlas! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Project Structure](#project-structure)
- [Contact](#contact)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level. We expect all participants to treat each other with respect and professionalism.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community and project
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discriminatory comments, or personal attacks
- Trolling, insulting comments, or deliberate disruption
- Publishing others' private information without permission
- Any conduct that could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before you begin contributing, ensure you have the following installed:

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ or **yarn** 1.22+
- **Git** 2.40+
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/atlas-strategic-agent.git
cd atlas-strategic-agent
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/darshil0/atlas-strategic-agent.git
```

4. Install dependencies:

```bash
npm install
```

5. Set up environment variables:

```bash
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY
```

6. Verify the setup:

```bash
npm run dev
npm test
```

---

## Development Workflow

### Branch Strategy

We follow a simple branching model:

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test improvements

### Creating a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create your feature branch
git checkout -b feature/amazing-feature
```

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Ensure all tests pass: `npm test`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Check TypeScript: `npm run type-check`

### Keeping Your Branch Updated

```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/main
```

---

## Coding Standards

### TypeScript

- Use **strict mode** - all code must pass TypeScript strict checks
- Prefer interfaces over types for object shapes
- Use explicit return types for functions
- Avoid `any` type - use `unknown` if type is truly unknown
- Use const assertions where appropriate

**Good:**
```typescript
interface TaskProps {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
}

function createTask(props: TaskProps): Task {
  // Implementation
}
```

**Bad:**
```typescript
function createTask(props: any) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Extract custom hooks for reusable logic
- Keep components small and focused (< 200 lines)
- Use proper prop typing with interfaces
- Implement proper error boundaries

**Good:**
```typescript
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  // Component logic
}
```

### CSS and Styling

- Use Tailwind utility classes for styling
- Follow the existing glassmorphic design system
- Ensure responsive design (mobile-first)
- Maintain WCAG AAA contrast ratios
- Use semantic HTML elements

### Code Organization

- One component per file
- Group related functionality
- Use barrel exports (index.ts) for clean imports
- Keep functions pure where possible
- Separate business logic from UI logic

---

## Testing Requirements

### Coverage Requirements

All contributions must maintain or improve the **80% coverage threshold**:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Writing Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run coverage

# Open test UI
npm run test:ui
```

### Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('should render task title', () => {
    const task = { id: '1', title: 'Test Task', priority: 'high' };
    render(<TaskCard task={task} onUpdate={vi.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should call onUpdate when edited', () => {
    const onUpdate = vi.fn();
    const task = { id: '1', title: 'Test Task', priority: 'high' };
    render(<TaskCard task={task} onUpdate={onUpdate} />);
    // Test interaction
  });
});
```

### Testing Best Practices

- Test user behavior, not implementation details
- Use meaningful test descriptions
- Keep tests focused and isolated
- Mock external dependencies
- Test error cases and edge cases

---

## Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
feat(agent): add Monte Carlo risk simulation

Implements probability distribution modeling for timeline predictions.
Includes new MonteCarlo service with statistical analysis.

Closes #123

fix(ui): resolve race condition in dependency graph

The XYFlow component was causing crashes when tasks were updated
rapidly. Added debouncing and proper cleanup in useEffect.

Fixes #456

docs(readme): update installation instructions

Added troubleshooting section for common setup issues.
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant
- Keep commits atomic and focused

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Coverage meets 80% threshold
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines
- [ ] Branch is up-to-date with main

### Submitting a Pull Request

1. Push your branch to your fork:

```bash
git push origin feature/amazing-feature
```

2. Go to the repository on GitHub and click "New Pull Request"

3. Fill out the PR template with:
   - Clear description of changes
   - Link to related issues
   - Screenshots (for UI changes)
   - Testing performed
   - Breaking changes (if any)

4. Request review from maintainers

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Closes #123
Relates to #456

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] Coverage threshold is maintained
```

### Review Process

- Maintainers will review your PR within 48 hours
- Address feedback and push updates to your branch
- Once approved, a maintainer will merge your PR
- Your contribution will be included in the next release

---

## Issue Guidelines

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if it's already fixed in the main branch
- Gather relevant information (browser, OS, versions)

### Bug Reports

Use the bug report template and include:

- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or error messages
- Environment details

**Example:**

```markdown
**Bug Description**
Dependency graph crashes when loading large roadmaps (100+ tasks)

**Steps to Reproduce**
1. Create a new strategic plan
2. Add 150+ tasks with dependencies
3. Open the dependency visualization
4. Browser tab crashes

**Expected Behavior**
Graph should render smoothly with proper virtualization

**Environment**
- Browser: Chrome 120.0.6099.109
- OS: macOS 14.2
- Atlas Version: 3.2.2
```

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)
- Mockups or examples (optional)

**Example:**

```markdown
**Feature Description**
Add Excel import/export functionality for bulk task management

**Use Case**
Enterprise users often have existing roadmaps in Excel and need to 
migrate them to Atlas without manual entry.

**Proposed Solution**
- Add "Import from Excel" button
- Support .xlsx and .csv formats
- Map columns to task properties
- Validate data before import

**Benefits**
- Reduces onboarding time for new users
- Enables bulk updates
- Improves enterprise adoption
```

---

## Project Structure

Understanding the project structure will help you navigate the codebase:

```text
atlas-strategic-agent/
├── src/
│   ├── components/          # React UI components
│   │   ├── TaskCard.tsx
│   │   └── DependencyGraph.tsx
│   ├── config/              # Configuration files
│   │   ├── env.ts
│   │   └── prompts.ts
│   ├── data/                # Static Data & Templates
│   │   └── taskBank.ts
│   ├── lib/
│   │   └── adk/            # Agent Development Kit
│   │       ├── agents.ts
│   │       ├── factory.ts
│   │       └── protocol.ts
│   ├── services/           # External service integrations
│   │   ├── geminiService.ts
│   │   ├── githubService.ts
│   │   └── jiraService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── test/               # Test infrastructure
│       ├── setup.ts
│       └── smoke.test.ts
├── docs/                   # Additional documentation
├── public/                 # Static assets
└── [config files]          # Build and dev configs
```

### Key Directories

- **components/** - Reusable React components with tests
- **lib/adk/** - Core agent system logic
- **services/** - External API integrations
- **types/** - Shared TypeScript interfaces
- **test/** - Test infrastructure and utilities

---

## Contact

### Getting Help

- **GitHub Discussions** - [Start a discussion](https://github.com/darshil0/atlas-strategic-agent/discussions)
- **GitHub Issues** - [Report bugs or request features](https://github.com/darshil0/atlas-strategic-agent/issues)
- **Email** - contact@darshilshah.com

### Maintainers

- **Darshil Shah** ([@darshil0](https://github.com/darshil0)) - Project Lead & Architecture

---

## Recognition

### Contributors

All contributors will be recognized in:

- The project README
- Release notes for their contributions
- The project's contributor graph

### First-Time Contributors

We especially welcome first-time contributors! Look for issues labeled `good first issue` or `help wanted` to get started.

---

## License

By contributing to Atlas Strategic Agent, you agree that your contributions will be licensed under the same license as the project.

---

<div align="center">

**Thank you for contributing to Atlas Strategic Agent!**

*Building the future of strategic planning together*

</div>

/**
 * Atlas App Component Tests (v3.2.1) - Glassmorphic E2E Integration
 * Production React Testing Library suite for MissionControl dashboard
 * Tests user flows: Goal Input → Agent Swarm → ReactFlow → GitHub/Jira sync
 */

import { describe, it, expect, vi, beforeEach, waitFor } from "vitest";
import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { ATLAS_TEST_UTILS } from "@/test/setup";
import { PersistenceService } from "@/services/persistenceService";

// Comprehensive mocks for production app
vi.mock("@/services/gemini.service", () => ({
  AtlasService: {
    generatePlan: vi.fn().mockResolvedValue(ATLAS_TEST_UTILS.createMockPlan()),
    executeSubtask: vi.fn().mockResolvedValue({ text: "Task completed", a2ui: undefined }),
  },
}));

vi.mock("@services/sync", () => ({
  syncServices: {
    syncToAll: vi.fn().mockResolvedValue({ totalCreated: 8, timestamp: new Date().toISOString() }),
    healthCheck: vi.fn().mockResolvedValue([
      { service: "GitHub", healthy: true },
      { service: "Jira", healthy: true },
    ]),
  },
  githubService: { syncPlan: vi.fn().mockResolvedValue({ created: 5 }) },
  jiraService: { syncPlan: vi.fn().mockResolvedValue({ created: 3 }) },
}));

describe("🏛️ ATLAS App - Glassmorphic User Experience", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    // Reset mocks and storage
    vi.clearAllMocks();
    PersistenceService.clearAll();
    
    // Mock successful API responses
    vi.mocked(AtlasService.generatePlan).mockResolvedValue(ATLAS_TEST_UTILS.createMockPlan());
  });

  it("renders glassmorphic Atlas branding without crashing", () => {
    render(<App />);
    
    // Glassmorphic hero + branding
    expect(screen.getByRole('heading', { name: /atlas/i })).toBeVisible();
    expect(screen.getByText(/v3\.2\.1/i)).toBeInTheDocument();
    expect(screen.getByText(/strategic agent/i)).toBeVisible();
    
    // Glassmorphic containers
    expect(screen.getByTestId("mission-control-dashboard")).toBeInTheDocument();
  });

  it("shows initial MissionControl dashboard with agent swarm", () => {
    render(<App />);
    
    // Agent selector
    expect(screen.getByRole('button', { name: /strategist/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /analyst/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /critic/i })).toBeVisible();
    
    // Glassmorphic UI elements
    expect(screen.getByRole('progressbar', { name: /plan quality/i })).toBeInTheDocument();
    expect(screen.getByTestId("taskbank-stats")).toBeVisible();
  });

  it("handles goal input → generates 2026 roadmap", async () => {
    render(<App />);
    
    // 1. User enters strategic goal
    const goalInput = screen.getByRole('textbox', { name: /strategic goal/i });
    await user.type(goalInput, "AI Transformation Q1 2026");
    
    // 2. Click generate
    const generateButton = screen.getByRole('button', { name: /generate roadmap/i });
    await user.click(generateButton);
    
    // 3. Loading state appears
    expect(screen.getByText(/synthesis in progress/i)).toBeVisible();
    
    // 4. MissionControl completes
    await waitFor(() => {
      expect(screen.getByText(/synthesis complete/i)).toBeVisible();
    });
    
    // 5. ReactFlow graph renders
    await waitFor(() => {
      expect(screen.getByTestId("reactflow-container")).toBeVisible();
    });
    
    // 6. Q1 stats update
    expect(screen.getByText(/q1 critical/i)).toBeVisible();
  });

  it("syncs roadmap to GitHub + Jira enterprise tools", async () => {
    render(<App />);
    
    // Pre-populate mock plan
    PersistenceService.savePlan(ATLAS_TEST_UTILS.createMockPlan());
    
    // Click sync button
    const syncButton = screen.getByRole('button', { name: /sync to enterprise/i });
    await user.click(syncButton);
    
    // Sync status updates
    await waitFor(() => {
      expect(screen.getByText(/8 tasks synced/i)).toBeVisible();
    });
    
    // Success toast appears
    expect(screen.getByRole('alert', { name: /sync complete/i })).toBeVisible();
  });

  it("displays TaskBank dashboard with filters", async () => {
    render(<App />);
    
    // Open TaskBank
    const taskBankButton = screen.getByRole('button', { name: /taskbank/i });
    await user.click(taskBankButton);
    
    // Stats render
    expect(screen.getByText(/90\+ objectives/i)).toBeVisible();
    expect(screen.getByRole('progressbar', { name: /q1 capacity/i })).toBeVisible();
    
    // Theme filters work
    const aiFilter = screen.getByRole('checkbox', { name: /ai/i });
    await user.click(aiFilter);
    
    await waitFor(() => {
      expect(screen.getByText(/ai tasks/i)).toBeVisible();
    });
  });

  it("handles agent swarm switching", async () => {
    render(<App />);
    
    // Switch to Analyst
    const analystButton = screen.getByRole('button', { name: /analyst/i });
    await user.click(analystButton);
    
    // Analyst UI appears
    await waitFor(() => {
      expect(screen.getByText(/feasibility analysis/i)).toBeVisible();
    });
    
    // Switch back to Strategist
    const strategistButton = screen.getByRole('button', { name: /strategist/i });
    await user.click(strategistButton);
    
    await waitFor(() => {
      expect(screen.getByText(/strategic synthesis/i)).toBeVisible();
    });
  });

  it("persists state across reloads", async () => {
    // Test 1: Save state
    const { unmount } = render(<App />);
    
    const goalInput = screen.getByRole('textbox', { name: /strategic goal/i });
    await user.type(goalInput, "Persisted test");
    PersistenceService.savePlan(ATLAS_TEST_UTILS.createMockPlan());
    
    unmount();
    
    // Test 2: Reload with persisted state
    render(<App />);
    
    expect(screen.getByDisplayValue(/persisted test/i)).toBeVisible();
    expect(screen.getByText(/ai-26-q1-001/i)).toBeVisible();
  });

  it("shows glassmorphic error handling", async () => {
    // Mock API failure
    vi.mocked(AtlasService.generatePlan).mockRejectedValueOnce(new Error("API timeout"));
    
    render(<App />);
    
    const generateButton = screen.getByRole('button', { name: /generate roadmap/i });
    await user.click(generateButton);
    
    // Error toast appears
    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /api timeout/i })).toBeVisible();
    });
    
    // Retry button available
    expect(screen.getByRole('button', { name: /retry/i })).toBeVisible();
  });

  it("is fully accessible (a11y)", async () => {
    const { container } = render(<App />);
    
    // All interactive elements have proper ARIA
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
    
    // Progress bars have labels
    expect(screen.getAllByRole('progressbar')).toHaveLength.greaterThan(0);
  });
});

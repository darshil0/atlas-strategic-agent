import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the Gemini service
vi.mock("./services/gemini.service", () => ({
  generatePlan: vi.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it("renders the Atlas branding", () => {
    render(<App />);
    // Look for key text that should appear in the app
    const atlasElements = screen.queryAllByText(/atlas/i);
    expect(atlasElements.length).toBeGreaterThan(0);
  });

  it("checks for main application container", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});

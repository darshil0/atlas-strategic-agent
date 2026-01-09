import { describe, it, expect } from "vitest";
import { AgentFactory } from "../lib/adk/factory";
import { AgentPersona } from "../lib/adk/types";

describe("Project Structure Smoke Test", () => {
  it("should have a working test environment", () => {
    expect(true).toBe(true);
  });

  it("should resolve AgentFactory imports correctly", () => {
    // Simple sanity check that core logic imports work using the new structure
    const strategist = AgentFactory.create(AgentPersona.STRATEGIST);
    expect(strategist).toBeDefined();
    expect(strategist.name).toBe("Strategist");
  });
});

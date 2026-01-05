import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { AtlasService } from "../services/geminiService";
import { Plan } from "../types";
import { GoogleGenAI } from "@google/genai";

// 1. Define the mocks for the internal methods
const mockGenerateContent = vi.fn();
const mockGenerateContentStream = vi.fn();

// 2. Mock the entire module
vi.mock("@google/genai", () => {
  // Return the mocked implementation of the module
  return {
    // Mock the GoogleGenAI class constructor
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      // The constructor returns an object with the `models` property
      models: {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
      },
    })),
    // Mock the `Type` enum used in the service file
    Type: {
      OBJECT: "object",
      STRING: "string",
      ARRAY: "array",
      BOOLEAN: "boolean",
    },
  };
});

// Get a reference to the mocked constructor for making assertions
const mockedGoogleGenAIConstructor = vi.mocked(GoogleGenAI);

describe("AtlasService", () => {
  const originalApiKey = process.env.API_KEY;

  beforeEach(() => {
    // Clear mock history before each test
    vi.clearAllMocks();
    // Set a dummy API key for the tests
    process.env.API_KEY = "test-api-key";
  });

  afterAll(() => {
    // Restore the original API key after all tests are done
    process.env.API_KEY = originalApiKey;
  });

  it("should throw an error if API_KEY is not set", async () => {
    delete process.env.API_KEY;
    await expect(AtlasService.generatePlan("test")).rejects.toThrow(
      "API_KEY environment variable not set"
    );
  });

  describe("generatePlan", () => {
    it("should generate a plan successfully", async () => {
      const mockPlan: Plan = {
        projectName: "Test Project",
        goal: "Test Goal",
        tasks: [],
      };
      // 3. Setup the mock response for this test case
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(mockPlan) });

      const plan = await AtlasService.generatePlan("Create a test plan");

      expect(plan).toEqual(mockPlan);
      expect(mockedGoogleGenAIConstructor).toHaveBeenCalledWith({
        apiKey: "test-api-key",
      });
      expect(mockGenerateContent).toHaveBeenCalledOnce();
    });

    it("should throw a specific error for invalid JSON response", async () => {
      mockGenerateContent.mockResolvedValue({ text: "invalid json" });
      await expect(AtlasService.generatePlan("test")).rejects.toThrow(
        "Neural decomposition failed to synchronize. Structure compromised."
      );
    });

    it("should throw a generic error if the API call fails", async () => {
      mockGenerateContent.mockRejectedValue(new Error("API Error"));
      await expect(AtlasService.generatePlan("test")).rejects.toThrow(
        "Failed to generate a valid plan from the API."
      );
    });
  });

  describe("executeSubtask", () => {
    it("should execute a subtask and stream results", async () => {
      const mockStream = (async function* () {
        yield { text: "Part 1" };
        yield { text: "Part 2" };
      })();

      mockGenerateContentStream.mockResolvedValue(mockStream);
      const onChunk = vi.fn();

      const result = await AtlasService.executeSubtask(
        "Do something",
        "Context",
        onChunk
      );

      expect(result.text).toBe("Part 1Part 2");
      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenCalledWith("Part 1");
      expect(onChunk).toHaveBeenCalledWith("Part 2");
      expect(mockGenerateContentStream).toHaveBeenCalledOnce();
    });

    it("should throw an error if the API stream fails", async () => {
      mockGenerateContentStream.mockRejectedValue(new Error("API Error"));
      await expect(
        AtlasService.executeSubtask("test", "context")
      ).rejects.toThrow("Failed to execute subtask due to an API error.");
    });
  });

  describe("summarizeMission", () => {
    it("should summarize the mission successfully", async () => {
      const summary = "Mission was a success.";
      mockGenerateContent.mockResolvedValue({ text: summary });
      const mockPlan: Plan = { projectName: "Test", goal: "Goal", tasks: [] };

      const result = await AtlasService.summarizeMission(mockPlan, "History");

      expect(result).toBe(summary);
      expect(mockGenerateContent).toHaveBeenCalledOnce();
    });

    it("should return a default message if the API returns empty text", async () => {
      mockGenerateContent.mockResolvedValue({ text: "" });
      const mockPlan: Plan = { projectName: "Test", goal: "Goal", tasks: [] };
      const result = await AtlasService.summarizeMission(mockPlan, "History");
      expect(result).toBe("Mission synchronized successfully.");
    });

    it("should throw an error if the API call fails", async () => {
      mockGenerateContent.mockRejectedValue(new Error("API Error"));
      const mockPlan: Plan = { projectName: "Test", goal: "Goal", tasks: [] };
      await expect(
        AtlasService.summarizeMission(mockPlan, "History")
      ).rejects.toThrow("Failed to summarize the mission due to an API error.");
    });
  });
});

import { GoogleGenerativeAI, SchemaType, GenerativeModelResult, GenerateContentResult } from "@google/generative-ai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, Citation } from "../types";

const getGoogleAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY environment variable not set");
  return new GoogleGenerativeAI(apiKey);
};

export class AtlasService {
  private static readonly PLANNING_MODEL = "gemini-1.5-pro";
  private static readonly EXECUTION_MODEL = "gemini-1.5-flash";

  static async generatePlan(userPrompt: string): Promise<Plan> {
    const genAI = getGoogleAI();

    try {
      const model = genAI.getGenerativeModel({
        model: this.PLANNING_MODEL,
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              projectName: { type: SchemaType.STRING },
              timeline: { type: SchemaType.STRING },
              goal: { type: SchemaType.STRING },
              tasks: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    id: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    status: { type: SchemaType.STRING },
                    priority: {
                      type: SchemaType.STRING,
                      enum: ["high", "medium", "low"],
                    },
                    category: { type: SchemaType.STRING },
                    dependencies: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING },
                    },
                    parentId: { type: SchemaType.STRING },
                    duration: { type: SchemaType.STRING },
                    output: { type: SchemaType.STRING },
                  },
                  required: ["id", "description", "status", "priority"],
                },
              },
              milestones: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    id: { type: SchemaType.STRING },
                    name: { type: SchemaType.STRING },
                    date: { type: SchemaType.STRING },
                    successCriteria: { type: SchemaType.STRING },
                    isReached: { type: SchemaType.BOOLEAN },
                  },
                  required: ["id", "name", "successCriteria"],
                },
              },
            },
            required: ["projectName", "goal", "tasks"],
          },
        },
      });

      const result: GenerateContentResult = await model.generateContent(
        `Strategic Request: ${userPrompt}\n\nInitiate Phase 2 - Strategic Decomposition.`
      );

      const responseText = await result.response?.text();
      return JSON.parse(responseText || "{}") as Plan;
    } catch (error) {
      console.error("Error generating plan:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to generate plan: ${error.message}`
          : "Unknown error during plan generation"
      );
    }
  }

  static async executeSubtask(
    subtaskDescription: string,
    context: string,
    onChunk?: (text: string) => void
  ): Promise<{ text: string; citations: Citation[] }> {
    const genAI = getGoogleAI();
    try {
      const model = genAI.getGenerativeModel({
        model: this.EXECUTION_MODEL,
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearchRetrieval: {} }],
      });

      const result = await model.generateContentStream({
        contents: [
          {
            role: "user",
            parts: [
              { text: `Context: ${context}\n\nTask Directive: ${subtaskDescription}` },
            ],
          },
        ],
      });

      let fullText = "";
      const citations: Citation[] = [];

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullText += text;
          if (onChunk) onChunk(text);
        }

        const grounding = chunk.candidates?.[0]?.groundingMetadata;
        const entry = grounding?.searchEntryPoint;
        if (entry) {
          citations.push({
            source: entry.displayName ?? "Google Search",
            url: entry.uri ?? "",
          });
        }
      }

      return { text: fullText.trim(), citations };
    } catch (error) {
      console.error("Error executing subtask:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to execute subtask: ${error.message}`
          : "Failed to execute subtask due to an API issue"
      );
    }
  }

  static async summarizeMission(plan: Plan, history: string): Promise<string> {
    const genAI = getGoogleAI();
    try {
      const model = genAI.getGenerativeModel({
        model: this.PLANNING_MODEL,
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
      });

      const result: GenerateContentResult = await model.generateContent(
        `Phase 4 - Completion Summary.\nProject: ${plan.projectName}\nGoal: ${plan.goal}\nExecution Path: ${history}`
      );

      return await result.response.text();
    } catch (error) {
      console.error("Error summarizing mission:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to summarize mission: ${error.message}`
          : "Failed to summarize mission."
      );
    }
  }
}

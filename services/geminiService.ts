
import { GoogleGenAI, SchemaType } from "@google/genai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, TaskStatus, Priority } from "../types";

// Support both Vite's import.meta.env and the defined process.env from vite.config.ts
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') ||
  (typeof process !== 'undefined' ? process.env.API_KEY : '');

const genAI = new GoogleGenAI(apiKey || "");

export class AtlasService {
  private static modelName = 'gemini-1.5-flash';

  static async generatePlan(userPrompt: string): Promise<Plan> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `User Request: ${userPrompt}\n\nDecompose this request into a structured plan for Atlas. Identify dependencies between subtasks. For each subtask, assign a priority ('high', 'medium', 'low') based on its importance to the overall mission. For long-term requests, assign logical categories (e.g. '2025 Q1', '2026 Strategy'). Output ONLY the JSON object.` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            goal: { type: SchemaType.STRING },
            tasks: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  description: { type: SchemaType.STRING },
                  status: { type: SchemaType.STRING, description: 'Must be "pending"' },
                  priority: { type: SchemaType.STRING, description: 'Must be "high", "medium", or "low"' },
                  category: { type: SchemaType.STRING },
                  dependencies: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                  },
                },
                required: ["id", "description", "status"]
              }
            }
          },
          required: ["goal", "tasks"]
        }
      }
    });

    try {
      const response = await result.response;
      const text = response.text();
      const plan = JSON.parse(text || "{}");
      return plan as Plan;
    } catch (e) {
      console.error("Failed to parse plan JSON", e);
      throw new Error("Atlas failed to generate a coherent plan.");
    }
  }

  static async executeSubtask(
    subtask: string,
    context: string,
    onChunk?: (text: string) => void
  ): Promise<string> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
    });

    // Note: tools might need specific model support or API versions
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: `Context: ${context}\n\nCurrent Task: ${subtask}\n\nPlease execute this subtask. Describe your actions and provide the result.` }] }],
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;
      if (onChunk) onChunk(text);
    }
    return fullText;
  }

  static async summarizeMission(plan: Plan, executionHistory: string): Promise<string> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Mission Summary Request.\nGoal: ${plan.goal}\nHistory: ${executionHistory}\n\nProvide a concise final report.` }] }],
    });
    const response = await result.response;
    return response.text() || "Mission complete.";
  }
}

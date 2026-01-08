import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, SubTask } from "../types";

/**
 * Enterprise Service Layer for Gemini API Interactions
 */
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (typeof (globalThis as any).process !== 'undefined' ? (globalThis as any).process.env.GEMINI_API_KEY : '') ||
  (typeof (globalThis as any).process !== 'undefined' ? (globalThis as any).process.env.API_KEY : '');

const genAI = new GoogleGenerativeAI(apiKey || "");

export class AtlasService {
  private static modelName = 'gemini-1.5-flash';

  private static A2UI_INSTRUCTION = `
Additionally, you are capable of generating native UI components using the A2UI (Agent-to-User Interface) protocol.
Wrap the A2UI JSON payload in <a2ui></a2ui> tags if user interaction is needed.
`;

  static async generatePlan(userPrompt: string): Promise<Plan> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION + this.A2UI_INSTRUCTION,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Request: ${userPrompt}\nDecompose into JSON plan. Categorize by Q/Year. Identify dependencies.` }] }],
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
                  status: { type: SchemaType.STRING },
                  priority: { type: SchemaType.STRING },
                  category: { type: SchemaType.STRING },
                  dependencies: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
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
      return JSON.parse(response.text()) as Plan;
    } catch {
      throw new Error("Atlas failed to generate a coherent plan.");
    }
  }

  static async executeSubtask(
    subtask: SubTask,
    plan: Plan,
    history: string,
    onChunk?: (text: string) => void
  ): Promise<{ text: string; a2ui?: string }> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION + this.A2UI_INSTRUCTION,
    });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: `Goal: ${plan.goal}\nHistory: ${history}\nTask: ${subtask.description}` }] }],
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;
      if (onChunk) onChunk(text);
    }

    const a2uiMatch = fullText.match(/<a2ui>([\s\S]*?)<\/a2ui>/);
    return {
      text: fullText.replace(/<a2ui>[\s\S]*?<\/a2ui>/g, '').trim(),
      a2ui: a2uiMatch?.[1]?.trim()
    };
  }

  static async summarizeMission(plan: Plan, executionHistory: string): Promise<string> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Summarize:\nGoal: ${plan.goal}\nHistory: ${executionHistory}` }] }],
    });
    const response = await result.response;
    return response.text();
  }
}


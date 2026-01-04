
import { GoogleGenAI, Type } from "@google/genai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, TaskStatus, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class AtlasService {
  private static modelName = 'gemini-3-flash-preview';

  static async generatePlan(userPrompt: string): Promise<Plan> {
    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: `User Request: ${userPrompt}\n\nDecompose this request into a structured plan for Atlas. Identify dependencies between subtasks using their IDs. For each subtask, assign a priority ('high', 'medium', 'low') and a logical category. Output ONLY the JSON object.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goal: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'Must be "pending"' },
                  priority: { type: Type.STRING, description: 'Must be "high", "medium", or "low"' },
                  category: { type: Type.STRING },
                  dependencies: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }
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
      const plan = JSON.parse(response.text || "{}");
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
    const responseStream = await ai.models.generateContentStream({
      model: this.modelName,
      contents: `Context: ${context}\n\nCurrent Task: ${subtask}\n\nPlease execute this subtask. Describe your actions and provide the result.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text || "";
      fullText += text;
      if (onChunk) onChunk(text);
    }
    return fullText;
  }

  static async summarizeMission(plan: Plan, executionHistory: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: `Mission Summary Request.\nGoal: ${plan.goal}\nHistory: ${executionHistory}\n\nProvide a concise final report.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION
      }
    });
    return response.text || "Mission complete.";
  }
}


import { GoogleGenAI, SchemaType } from "@google/genai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, TaskStatus, Priority } from "../types";
import { A2UIMessage } from "../lib/adk/protocol";

// Support both Vite's import.meta.env and the defined process.env from vite.config.ts
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') ||
  (typeof process !== 'undefined' ? process.env.API_KEY : '');

const genAI = new GoogleGenAI(apiKey || "");

export class AtlasService {
  private static modelName = 'gemini-1.5-flash';
  private static memoryStorage: string[] = [];

  private static A2UI_INSTRUCTION = `
Additionally, you are capable of generating native UI components using the A2UI (Agent-to-User Interface) protocol.
If a task requires user interaction (e.g., confirmation, data input, selection), wrap the A2UI JSON payload in <a2ui></a2ui> tags.
Example:
<a2ui>
{
  "version": "0.8",
  "elements": [{
    "id": "confirm_btn",
    "type": "button",
    "props": { "label": "Start Mission", "variant": "primary", "actionData": { "task": "start" } }
  }]
}
</a2ui>
`;

  static async generatePlan(userPrompt: string): Promise<Plan> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION + this.A2UI_INSTRUCTION,
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
  ): Promise<{ text: string; a2ui?: string }> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION + this.A2UI_INSTRUCTION,
    });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: `Context: ${context}\n\nCurrent Task: ${subtask}\n\nPlease execute this subtask. Describe your actions and provide the result.` }] }],
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;
      if (onChunk) onChunk(text);
    }

    // Extract A2UI if present
    const a2uiMatch = fullText.match(/<a2ui>([\s\S]*?)<\/a2ui>/);
    const a2ui = a2uiMatch ? a2uiMatch[1].trim() : undefined;
    const cleanText = fullText.replace(/<a2ui>[\s\S]*?<\/a2ui>/g, '').trim();

    return { text: cleanText, a2ui };
  }

  static async summarizeMission(plan: Plan, executionHistory: string): Promise<string> {
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ATLAS_SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Mission Summary Request.\nGoal: ${plan.goal}\nHistory: ${executionHistory}\n\nProvide a concise final report.` }] }],
    });
    const response = await result.response;
    return response.text() || "Mission complete.";
  }

  /**
   * Phase 3: Live Grounding Tool
   */
  static async searchExternal(query: string): Promise<string> {
    console.log(`[ATLAS EXTERNAL SEARCH] Scanning for: ${query}`);
    // Simulate high-fidelity search result retrieval
    return `Retrieved strategic intelligence for "${query}": Recent market shifts indicate a trend towards decentralized AI orchestration as predicted in Q3. Major players are adopting glassmorphic interfaces for enterprise tools.`;
  }

  /**
   * Phase 4: Intelligence & Memory 2.0
   */
  static async recordStrategicPattern(pattern: string) {
    this.memoryStorage.push(pattern);
    console.log(`[ATLAS MEMORY] Recorded strategic pattern: ${pattern}`);
  }

  static async recallStrategicPatterns(query: string): Promise<string[]> {
    return this.memoryStorage.filter(p => p.toLowerCase().includes(query.toLowerCase()));
  }
}

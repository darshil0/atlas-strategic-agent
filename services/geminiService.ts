import { GoogleGenAI, Type } from "@google/genai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, TaskStatus, Citation } from "../types";

export class AtlasService {
  private static PLANNING_MODEL = 'gemini-3-pro-preview';
  private static EXECUTION_MODEL = 'gemini-3-flash-preview';

  static async generatePlan(userPrompt: string): Promise<Plan> {
    // Create fresh instance to ensure correct API key usage per instructions
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: this.PLANNING_MODEL,
      contents: `User Request: ${userPrompt}\n\nDecompose this request into a structured hierarchical plan. Identify dependencies between subtasks. For each subtask, assign a priority and logical category. Use Task IDs.`,
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
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
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
      throw new Error("Atlas Strategic failed to generate a coherent neural roadmap.");
    }
  }

  static async executeSubtask(
    subtask: string, 
    context: string, 
    onChunk?: (text: string) => void
  ): Promise<{ text: string, citations: Citation[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const responseStream = await ai.models.generateContentStream({
      model: this.EXECUTION_MODEL,
      contents: `Context: ${context}\n\nCurrent Operational Task: ${subtask}\n\nExecute with technical precision. Provide results and reasoning.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });

    let fullText = "";
    let citations: Citation[] = [];

    for await (const chunk of responseStream) {
      const text = chunk.text || "";
      fullText += text;
      
      // Extract grounding metadata from the stream chunks
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach(chunk => {
          if (chunk.web) {
            citations.push({
              uri: chunk.web.uri,
              title: chunk.web.title
            });
          }
        });
      }

      if (onChunk) onChunk(text);
    }

    // Deduplicate citations
    const uniqueCitations = Array.from(new Map(citations.map(c => [c.uri, c])).values());

    return { text: fullText, citations: uniqueCitations };
  }

  static async summarizeMission(plan: Plan, executionHistory: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: this.PLANNING_MODEL,
      contents: `Mission Summary Request.\nGoal: ${plan.goal}\nFull Execution History: ${executionHistory}\n\nProvide a high-level strategic synthesis and learning report.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION
      }
    });
    return response.text || "Mission synchronized successfully.";
  }
}
import { GoogleGenAI, Type } from "@google/genai";
import { ATLAS_SYSTEM_INSTRUCTION } from "../constants";
import { Plan, Citation } from "../types";

export class AtlasService {
  private static PLANNING_MODEL = "gemini-3-pro-preview";
  private static EXECUTION_MODEL = "gemini-3-flash-preview";

  static async generatePlan(userPrompt: string): Promise<Plan> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: this.PLANNING_MODEL,
      contents: `Strategic Request: ${userPrompt}\n\nInitiate Phase 2 - Strategic Decomposition. Create a hierarchical, multi-level plan.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING },
            timeline: { type: Type.STRING },
            goal: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                  status: {
                    type: Type.STRING,
                    description: 'Must be "pending"',
                  },
                  priority: {
                    type: Type.STRING,
                    enum: ["high", "medium", "low"],
                  },
                  category: { type: Type.STRING },
                  dependencies: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  parentId: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  output: { type: Type.STRING },
                },
                required: ["id", "description", "status", "priority"],
              },
            },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  date: { type: Type.STRING },
                  successCriteria: { type: Type.STRING },
                  isReached: { type: Type.BOOLEAN },
                },
                required: ["id", "name", "successCriteria"],
              },
            },
          },
          required: ["projectName", "goal", "tasks"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}") as Plan;
    } catch (e) {
      console.error("Plan Parsing Error", e);
      throw new Error(
        "Neural decomposition failed to synchronize. Structure compromised.",
      );
    }
  }

  static async executeSubtask(
    subtaskDescription: string,
    context: string,
    onChunk?: (text: string) => void,
  ): Promise<{ text: string; citations: Citation[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const responseStream = await ai.models.generateContentStream({
      model: this.EXECUTION_MODEL,
      contents: `Context: ${context}\n\nTask Directive: ${subtaskDescription}\n\nExecute with technical thoroughness. State reasoning and findings.`,
      config: {
        systemInstruction: ATLAS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    let fullText = "";
    let citations: Citation[] = [];

    for await (const chunk of responseStream) {
      const text = chunk.text || "";
      fullText += text;

      const grounding = chunk.candidates?.[0]?.groundingMetadata;
      if (grounding?.groundingChunks) {
        grounding.groundingChunks.forEach((c) => {
          if (c.web) {
            citations.push({ uri: c.web.uri, title: c.web.title });
          }
        });
      }

      if (onChunk) onChunk(text);
    }

    // Deduplicate
    const uniqueCitations = Array.from(
      new Map(citations.map((c) => [c.uri, c])).values(),
    );

    return { text: fullText, citations: uniqueCitations };
  }

  static async summarizeMission(plan: Plan, history: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: this.PLANNING_MODEL,
      contents: `Phase 4 - Completion Summary.\nProject: ${plan.projectName}\nGoal: ${plan.goal}\nExecution Path: ${history}`,
      config: { systemInstruction: ATLAS_SYSTEM_INSTRUCTION },
    });
    return response.text || "Mission synchronized successfully.";
  }
}

import { GoogleGenerativeAI, SchemaType, GenerativeModel, ResponseSchema } from "@google/generative-ai";
import { ATLAS_SYSTEM_INSTRUCTION, ENV } from "../config";
import { Plan, SubTask, TaskStatus, Priority } from "../types";
import { validateA2UIMessage, A2UIMessage } from "../lib/adk/protocol";

/**
 * Enterprise Gemini Service Layer for Atlas Strategic Agent
 * Handles all LLM interactions with structured JSON schema enforcement
 */
if (!ENV.GEMINI_API_KEY) {
  throw new Error("🚨 GEMINI_API_KEY required. Set VITE_GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export class AtlasService {
  private static readonly modelName = "gemini-2.0-flash-exp"; // Updated Jan 2026 model
  private static readonly maxRetries = 3;
  private static readonly timeoutMs = 60_000; // 60s timeout

  private static getModel(withA2UI = false): GenerativeModel {
    const systemInstruction = withA2UI
      ? ATLAS_SYSTEM_INSTRUCTION + "\n\nGenerate A2UI JSON in response when UI needed."
      : ATLAS_SYSTEM_INSTRUCTION;

    return genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction,
      generationConfig: {
        temperature: 0.1,  // Low creativity for structured output
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Generate structured strategic plan with JSON schema enforcement
   */
  static async generatePlan(userPrompt: string): Promise<Plan> {
    const model = this.getModel(false);

    const schema: ResponseSchema = {
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
              status: {
                type: SchemaType.STRING,
                enum: Object.values(TaskStatus)
              },
              priority: {
                type: SchemaType.STRING,
                enum: Object.values(Priority)
              },
              category: { type: SchemaType.STRING },
              dependencies: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
              },
            },
            required: ["id", "description", "status", "priority", "category"],
          },
        },
      },
      required: ["goal", "tasks"],
    };

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [{
              text: `Generate 2026 strategic roadmap for: "${userPrompt}"\n\nUse realistic Q1-Q4 categories and TASK_BANK ID patterns (AI-26-001).`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        });

        const response = await Promise.race([
          result.response,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), this.timeoutMs)
          )
        ]);

        const plan = this.parseResponse<Plan>(response.text());

        // Validate minimum plan quality
        if (plan.tasks.length >= 5 && plan.goal.trim()) {
          return plan;
        }
      } catch (error) {
        console.warn(`[AtlasService] Plan generation attempt ${attempt} failed:`, error);
      }
    }

    throw new Error("Failed to generate valid strategic plan after retries");
  }

  /**
   * Execute individual subtask with streaming + A2UI extraction
   */
  static async executeSubtask(
    subtask: SubTask,
    plan: Plan,
    history: string = "",
    onChunk?: (chunk: string) => void
  ): Promise<{ text: string; a2ui?: A2UIMessage }> {
    const model = this.getModel(true);

    const context = `
Goal: ${plan.goal}
Current Task: ${subtask.id} "${subtask.description}"
Progress: ${plan.tasks.filter(t => t.status === TaskStatus.COMPLETED).length}/${plan.tasks.length}
History: ${history.slice(-1000)}`;

    const result = await model.generateContentStream({
      contents: [{
        role: "user",
        parts: [{ text: context }]
      }],
    });

    let fullText = "";
    let a2uiCandidates: string[] = [];

    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;

      // Extract A2UI payloads in real-time
      const a2uiMatch = text.match(/<a2ui>[\s\S]*?<\/a2ui>/g);
      if (a2uiMatch) {
        a2uiCandidates.push(...a2uiMatch);
      }

      onChunk?.(text);
    }

    // Parse first valid A2UI message
    let a2ui: A2UIMessage | undefined;
    for (const candidate of a2uiCandidates) {
      const payload = candidate.slice(6, -8).trim(); // Remove <a2ui> tags
      const parsed = this.parseA2UI(payload);
      if (parsed) {
        a2ui = parsed;
        break;
      }
    }

    return {
      text: fullText.replace(/<a2ui>[\s\S]*?<\/a2ui>/gi, "").trim(),
      a2ui,
    };
  }

  /**
   * Generate mission summary with completion metrics
   */
  static async summarizeMission(plan: Plan, executionHistory: string): Promise<string> {
    const model = this.getModel(false);

    const metrics = {
      completed: plan.tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      total: plan.tasks.length,
      highPriorityRemaining: plan.tasks.filter(t =>
        t.priority === Priority.HIGH && t.status !== TaskStatus.COMPLETED
      ).length,
    };

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `Summarize mission:\nGoal: ${plan.goal}\nMetrics: ${JSON.stringify(metrics)}\nHistory: ${executionHistory.slice(-2000)}`
        }]
      }]
    });

    return (await result.response).text();
  }

  private static parseResponse<T>(text: string): T {
    const cleanText = text
      .replace(/```(?:json)?\n?|\n?```/g, "")
      .replace(/^\s*[\[\{]/, "")  // Remove leading [
      .replace(/[\]\}]\s*$/, "")  // Remove trailing ]
      .trim();

    try {
      return JSON.parse(cleanText) as T;
    } catch (error) {
      console.error("[AtlasService] Parse error:", { text: cleanText.slice(0, 200), error });
      throw new Error("Failed to parse structured response from Gemini");
    }
  }

  private static parseA2UI(text: string): A2UIMessage | null {
    try {
      const parsed = JSON.parse(text);
      return validateA2UIMessage(parsed);
    } catch {
      return null;
    }
  }
}

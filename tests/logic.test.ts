import { describe, it, expect } from "vitest";
import { TaskStatus, SubTask, Priority } from "../types";

/**
 * ATLAS STRATEGIC - CORE LOGIC TESTS
 * Validates the underlying mathematical model of dependency and priority resolution.
 */

describe("Atlas Core Logic", () => {
  describe("testDependencyResolution", () => {
    const mockTasks: SubTask[] = [
      {
        id: "1",
        description: "Phase 1 Complete",
        status: TaskStatus.COMPLETED,
        priority: Priority.MEDIUM,
      },
      {
        id: "2",
        description: "Phase 2 Start",
        status: TaskStatus.PENDING,
        dependencies: ["1"],
        priority: Priority.MEDIUM,
      },
      {
        id: "3",
        description: "Phase 3 Blocked",
        status: TaskStatus.PENDING,
        dependencies: ["2"],
        priority: Priority.MEDIUM,
      },
    ];

    const isBlocked = (task: SubTask, allTasks: SubTask[]) => {
      if (!task.dependencies || task.dependencies.length === 0) return false;
      return task.dependencies.some((depId) => {
        const depTask = allTasks.find((t) => t.id === depId);
        return depTask && depTask.status !== TaskStatus.COMPLETED;
      });
    };

    it("should correctly identify a root task as runnable", () => {
      expect(isBlocked(mockTasks[0], mockTasks)).toBe(false);
    });

    it("should identify a task with completed dependencies as runnable", () => {
      expect(isBlocked(mockTasks[1], mockTasks)).toBe(false);
    });

    it("should identify a task with pending dependencies as blocked", () => {
      expect(isBlocked(mockTasks[2], mockTasks)).toBe(true);
    });
  });

  describe("testPrioritySorting", () => {
    const tasks: SubTask[] = [
      {
        id: "low",
        description: "Low task",
        status: TaskStatus.PENDING,
        priority: Priority.LOW,
      },
      {
        id: "high",
        description: "High task",
        status: TaskStatus.PENDING,
        priority: Priority.HIGH,
      },
      {
        id: "med",
        description: "Med task",
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
      },
    ];

    const priorityWeights = {
      [Priority.HIGH]: 3,
      [Priority.MEDIUM]: 2,
      [Priority.LOW]: 1,
    };

    it("should sort tasks by priority in descending order", () => {
      const sorted = [...tasks].sort(
        (a, b) =>
          (priorityWeights[b.priority || Priority.LOW] || 0) -
          (priorityWeights[a.priority || Priority.LOW] || 0)
      );
      expect(sorted[0].id).toBe("high");
      expect(sorted[1].id).toBe("med");
      expect(sorted[2].id).toBe("low");
    });
  });
});

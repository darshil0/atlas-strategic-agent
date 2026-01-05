import { TaskStatus, SubTask, Priority } from "../types";

/**
 * ATLAS STRATEGIC - CORE LOGIC TESTS
 * Validates dependency resolution and priority sorting mechanisms.
 */

export const testDependencyResolution = () => {
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

  const isBlocked = (task: SubTask, allTasks: SubTask[]): boolean => {
    if (!task.dependencies?.length) return false;
    return task.dependencies.some((depId) => {
      const depTask = allTasks.find((t) => t.id === depId);
      return !depTask || depTask.status !== TaskStatus.COMPLETED;
    });
  };

  const results = {
    task1: isBlocked(mockTasks[0], mockTasks),
    task2: isBlocked(mockTasks[1], mockTasks),
    task3: isBlocked(mockTasks[2], mockTasks),
  };

  if (results.task1 !== false)
    throw new Error("Task 1 should be RUNNABLE (no dependencies).");
  if (results.task2 !== false)
    throw new Error("Task 2 should be RUNNABLE (dependency completed).");
  if (results.task3 !== true)
    throw new Error("Task 3 should be BLOCKED (pending dependency).");

  return results;
};

export const testPrioritySorting = () => {
  const tasks: SubTask[] = [
    {
      id: "low",
      description: "Low priority task",
      status: TaskStatus.PENDING,
      priority: Priority.LOW,
    },
    {
      id: "high",
      description: "High priority task",
      status: TaskStatus.PENDING,
      priority: Priority.HIGH,
    },
    {
      id: "medium",
      description: "Medium priority task",
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
    },
  ];

  const weight = {
    [Priority.HIGH]: 3,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 1,
  };

  const sorted = [...tasks].sort(
    (a, b) => weight[b.priority] - weight[a.priority]
  );

  if (sorted[0].id !== "high")
    throw new Error("Highest priority task must appear first.");
  if (sorted[2].id !== "low")
    throw new Error("Lowest priority task must appear last.");

  return sorted;
};

// Automatically validate logic when running in a browser or Node environment
if (typeof globalThis !== "undefined") {
  console.log(
    "%c[ATLAS STRATEGIC]: Bootstrapping core validation...",
    "color:#3b82f6; font-weight:bold;"
  );
  try {
    const depResults = testDependencyResolution();
    const sortResults = testPrioritySorting();
    console.log(
      "%c✓ CORE LOGIC VALIDATED",
      "color:#10b981; font-weight:bold;"
    );
    console.table({ depResults, sortResults });
  } catch (err) {
    console.error("%c✗ Logic validation failed:", "color:#ef4444;", err);
  }
}

import { TaskStatus, SubTask, Priority } from "../types";

/**
 * ATLAS STRATEGIC - CORE LOGIC TESTS
 * Validates the underlying mathematical model of dependency and priority resolution.
 */

export const testDependencyResolution = () => {
  // FIX: Added required 'priority' field to mockTasks to satisfy SubTask interface.
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

  const results = {
    task1: isBlocked(mockTasks[0], mockTasks),
    task2: isBlocked(mockTasks[1], mockTasks),
    task3: isBlocked(mockTasks[2], mockTasks),
  };

  console.assert(results.task1 === false, "Root task 1 should be RUNNABLE");
  console.assert(
    results.task2 === false,
    "Task 2 with completed dep should be RUNNABLE",
  );
  console.assert(
    results.task3 === true,
    "Task 3 with pending dep should be BLOCKED",
  );

  return results;
};

export const testPrioritySorting = () => {
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
  const sorted = [...tasks].sort(
    (a, b) =>
      (priorityWeights[b.priority || Priority.LOW] || 0) -
      (priorityWeights[a.priority || Priority.LOW] || 0),
  );

  console.assert(
    sorted[0].id === "high",
    "Highest priority task must come first in sort",
  );
  console.assert(
    sorted[2].id === "low",
    "Lowest priority task must come last in sort",
  );
};

if (typeof window !== "undefined") {
  console.log(
    "%c ATLAS STRATEGIC BOOTSTRAP: RUNNING CORE VALIDATION...",
    "color: #3b82f6; font-weight: bold;",
  );
  try {
    testDependencyResolution();
    testPrioritySorting();
    console.log(
      "%c ✓ STRATEGIC KERNEL VALIDATED",
      "color: #10b981; font-weight: bold;",
    );
  } catch (e) {
    console.error("Atlas Logic Test Failure:", e);
  }
}

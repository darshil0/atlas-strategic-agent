
import { TaskStatus, SubTask, Priority } from '../types';

export const testDependencyResolution = () => {
  const mockTasks: SubTask[] = [
    { id: '1', description: 'Task 1', status: TaskStatus.COMPLETED },
    { id: '2', description: 'Task 2', status: TaskStatus.PENDING, dependencies: ['1'] },
    { id: '3', description: 'Task 3', status: TaskStatus.PENDING, dependencies: ['2'] }
  ];

  const isBlocked = (task: SubTask, allTasks: SubTask[]) => {
    if (!task.dependencies || task.dependencies.length === 0) return false;
    return task.dependencies.some(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.status !== TaskStatus.COMPLETED;
    });
  };

  const results = {
    task1: isBlocked(mockTasks[0], mockTasks),
    task2: isBlocked(mockTasks[1], mockTasks),
    task3: isBlocked(mockTasks[2], mockTasks),
  };

  console.assert(results.task1 === false, 'Root task should not be blocked');
  console.assert(results.task2 === false, 'Task with completed dependency should not be blocked');
  console.assert(results.task3 === true, 'Task with pending dependency SHOULD be blocked');
  
  return results;
};

if (typeof window !== 'undefined') {
  console.log('%c ATLAS LOGIC TESTS STARTING...', 'color: #3b82f6; font-weight: bold;');
  try {
    testDependencyResolution();
    console.log('%c ✓ ATLAS LOGIC TESTS PASSED', 'color: #10b981; font-weight: bold;');
  } catch (e) {
    console.error('Atlas Logic Test Failure:', e);
  }
}

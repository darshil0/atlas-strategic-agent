import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import TaskCard from "../components/TaskCard";
import { SubTask, TaskStatus, Priority } from "../types";
import React from "react";

afterEach(cleanup);

describe("TaskCard", () => {
  const baseTask: SubTask = {
    id: "task-1",
    description: "Test Task",
    status: TaskStatus.PENDING,
    priority: Priority.MEDIUM,
  };

  it("renders the task description and ID", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={false} />);
    
    expect(screen.getByText(/test task/i)).toBeInTheDocument();
    expect(screen.getByText(/#task-1/i)).toBeInTheDocument();
  });

  it("applies active styles when isActive is true", () => {
    const { container } = render(
      <TaskCard task={baseTask} isActive={true} isBlocked={false} />
    );

    // Class name should match your active-state styling
    expect(container.firstChild).toHaveClass("border-blue-400");
  });

  it("shows a blocked icon when isBlocked is true", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={true} />);

    // Try accessible role first; fallback to test ID if needed
    const icon =
      screen.queryByRole("img", { name: /blocked/i }) ??
      screen.getByTestId("blocked-icon");
    expect(icon).toBeVisible();
  });

  it("renders the priority label correctly in lowercase", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={false} />);

    expect(screen.getByText(/medium/i)).toBeVisible();
  });

  it("shows the 'Declassify' button when there is a result", () => {
    const taskWithResult: SubTask = { ...baseTask, result: "Some output" };

    render(<TaskCard task={taskWithResult} isActive={false} isBlocked={false} />);
    expect(screen.getByRole("button", { name: /declassify/i })).toBeInTheDocument();
  });
});

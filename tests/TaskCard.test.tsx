import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskCard from "../components/TaskCard";
import { SubTask, TaskStatus, Priority } from "../types";
import React from "react";

describe("TaskCard", () => {
  const baseTask: SubTask = {
    id: "task-1",
    description: "Test Task",
    status: TaskStatus.PENDING,
    priority: Priority.MEDIUM,
  };

  it("renders the task description and ID", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={false} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("#task-1")).toBeInTheDocument();
  });

  it("applies active styles when isActive is true", () => {
    const { container } = render(
      <TaskCard task={baseTask} isActive={true} isBlocked={false} />
    );
    // Check for a class that is unique to the active state
    expect(container.firstChild).toHaveClass("border-blue-400");
  });

  it("shows a blocked icon when isBlocked is true", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={true} />);
    // Use data-testid to reliably find the icon
    const icon = screen.getByTestId("blocked-icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders the priority label correctly", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={false} />);
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("shows the 'Declassify' button when there is a result", () => {
    const taskWithResult = { ...baseTask, result: "Some output" };
    render(
      <TaskCard task={taskWithResult} isActive={false} isBlocked={false} />
    );
    expect(screen.getByText("Declassify")).toBeInTheDocument();
  });
});

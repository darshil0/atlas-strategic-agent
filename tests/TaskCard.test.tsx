import { describe, it, expect } from "vitest";
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

    // Check for a class that should appear when the card is active.
    // Adjust this to match your component’s actual Tailwind or CSS classes.
    expect(container.firstChild).toHaveClass("border-blue-400");
  });

  it("shows a blocked icon when isBlocked is true", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={true} />);

    // Prefer using data-testid or alt text for reliability if the icon has no accessible name.
    const icon = screen.getByRole("img", { name: /blocked/i });
    expect(icon).toBeInTheDocument();
  });

  it("renders the priority label in lowercase correctly", () => {
    render(<TaskCard task={baseTask} isActive={false} isBlocked={false} />);

    // Normalize casing if your component capitalizes priority values.
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it("shows the 'Declassify' button when there is a result", () => {
    const taskWithResult = { ...baseTask, result: "Some output" };

    render(<TaskCard task={taskWithResult} isActive={false} isBlocked={false} />);
    expect(screen.getByRole("button", { name: /declassify/i })).toBeInTheDocument();
  });
});

import React from "react";
import { TaskStatus } from "../types";
import {
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  AlertCircle,
} from "lucide-react";

/**
 * Task Status Icons for TaskCard and DependencyGraph components
 * Pre-rendered React components with consistent sizing and theme colors
 */
const createIcon = (icon: React.ReactElement<{ className?: string }>, color: string): React.ReactElement => (
  React.cloneElement(icon, { className: `w-5 h-5 ${color}` })
);

export const ICONS: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.PENDING]: createIcon(<Circle />, "text-slate-400"),
  [TaskStatus.IN_PROGRESS]: createIcon(
    <Loader2 />,
    "text-blue-400 animate-spin"
  ),
  [TaskStatus.COMPLETED]: createIcon(<CheckCircle2 />, "text-emerald-400"),
  [TaskStatus.FAILED]: createIcon(<XCircle />, "text-rose-400"),
  [TaskStatus.BLOCKED]: createIcon(<Lock />, "text-slate-600"),
  [TaskStatus.WAITING]: createIcon(<Clock />, "text-amber-400"),
} as const;

/**
 * Dynamic icon accessor with fallback
 */
export const getTaskIcon = (status: TaskStatus): React.ReactNode => {
  return ICONS[status] || <AlertCircle className="w-5 h-5 text-slate-500" />;
};

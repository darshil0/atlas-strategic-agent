import React from "react";
import { TaskStatus } from "../types";
import {
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
} from "lucide-react";

type IconKey = TaskStatus;

export const ICONS: Record<IconKey, React.ReactNode> = {
  [TaskStatus.PENDING]: <Circle className="w-4 h-4 text-slate-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
  ),
  [TaskStatus.COMPLETED]: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  [TaskStatus.FAILED]: <XCircle className="w-4 h-4 text-rose-400" />,
  [TaskStatus.BLOCKED]: <Lock className="w-4 h-4 text-slate-600" />,
  [TaskStatus.WAITING]: <Clock className="w-4 h-4 text-amber-400" />,
};

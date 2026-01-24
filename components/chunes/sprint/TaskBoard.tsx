"use client";

import {
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Pause,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/chunes/ui/Card";
import { Badge } from "@/components/chunes/ui/Badge";
import type { SprintTask } from "@/lib/chunes/sprint-parser";

interface TaskBoardProps {
  tasks: SprintTask[];
}

function getStatusConfig(status: string) {
  const s = status.toLowerCase();

  if (s.includes("done") || s.includes("completed")) {
    return {
      icon: CheckCircle2,
      label: "Done",
    };
  }
  if (s.includes("running") || s.includes("in progress")) {
    return {
      icon: Play,
      label: "Running",
    };
  }
  if (s.includes("testing")) {
    return {
      icon: AlertTriangle,
      label: "Testing",
    };
  }
  if (s.includes("ready") || s.includes("queue")) {
    return {
      icon: Clock,
      label: "Ready",
    };
  }
  if (s.includes("blocked") || s.includes("paused")) {
    return {
      icon: Pause,
      label: "Blocked",
    };
  }
  return {
    icon: Circle,
    label: status,
  };
}

function getPriorityConfig(priority: string) {
  const p = priority.toLowerCase();

  if (p.includes("urgent")) {
    return { label: "Urgent", variant: "accent" as const };
  }
  if (p.includes("high")) {
    return { label: "High", variant: "warning" as const };
  }
  if (p.includes("medium")) {
    return { label: "Medium", variant: "default" as const };
  }
  if (p.includes("low")) {
    return { label: "Low", variant: "muted" as const };
  }
  return { label: priority, variant: "muted" as const };
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  // Sort tasks: Running first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const aRunning = a.status.toLowerCase().includes("running") ? 0 : 1;
    const bRunning = b.status.toLowerCase().includes("running") ? 0 : 1;
    if (aRunning !== bRunning) return aRunning - bRunning;

    const priorityOrder: Record<string, number> = {
      urgent: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    const aPriority = priorityOrder[a.priority.toLowerCase()] ?? 4;
    const bPriority = priorityOrder[b.priority.toLowerCase()] ?? 4;
    return aPriority - bPriority;
  });

  // Status summary
  const statusCounts = tasks.reduce((acc, task) => {
    const config = getStatusConfig(task.status);
    acc[config.label] = (acc[config.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Status Summary */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = getStatusConfig(status);
          return (
            <div
              key={status}
              className="border border-[var(--color-border)] px-4 py-2 flex items-center gap-3"
            >
              <div className="w-6 h-6 border border-[var(--color-border)] flex items-center justify-center">
                <config.icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <span className="text-sm uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)" }}>
                {count} {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Task Grid */}
      <div className="grid gap-0 border-t-2 border-l-2 border-[var(--color-border)]">
        {sortedTasks.map((task) => {
          const statusConfig = getStatusConfig(task.status);
          const priorityConfig = getPriorityConfig(task.priority);
          const StatusIcon = statusConfig.icon;
          const isRunning = task.status.toLowerCase().includes("running");
          const isDone = task.status.toLowerCase().includes("done");

          return (
            <Card
              key={task.id}
              variant="border"
              hoverable
              className={`
                border-l-0 border-t-0 border-r-2 border-b-2
                ${isRunning ? "border-[4px]" : ""}
                ${isDone ? "opacity-50" : ""}
              `}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Task ID */}
                      <code
                        className="text-xs px-2 py-1 border border-[var(--color-border)] bg-[var(--color-foreground)] text-[var(--color-accent-foreground)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {task.id}
                      </code>

                      {/* Priority Badge */}
                      <Badge variant={priorityConfig.variant} size="sm">
                        {priorityConfig.label}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-xl ${
                        isDone ? "line-through opacity-60" : ""
                      }`}
                      style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                    >
                      {task.title}
                    </h3>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 border border-[var(--color-border)] px-4 py-2">
                    <StatusIcon className="w-4 h-4" strokeWidth={1.5} />
                    <span
                      className="text-sm uppercase tracking-[0.1em]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Running indicator */}
                {isRunning && (
                  <div className="mt-4 h-1 bg-[var(--color-foreground)]" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

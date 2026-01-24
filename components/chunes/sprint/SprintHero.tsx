"use client";

import { Clock, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/chunes/ui/Badge";
import type { SprintData } from "@/lib/chunes/sprint-parser";

interface SprintHeroProps {
  sprint: SprintData;
  progress: number;
}

function getStatusConfig(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("not started")) {
    return {
      icon: Clock,
      text: "Not Started",
      variant: "muted" as const,
    };
  }
  if (normalizedStatus.includes("in progress") || normalizedStatus.includes("running")) {
    return {
      icon: Zap,
      text: "In Progress",
      variant: "accent" as const,
    };
  }
  if (normalizedStatus.includes("done") || normalizedStatus.includes("completed")) {
    return {
      icon: CheckCircle2,
      text: "Completed",
      variant: "success" as const,
    };
  }
  return {
    icon: AlertCircle,
    text: status,
    variant: "warning" as const,
  };
}

export function SprintHero({ sprint, progress }: SprintHeroProps) {
  const statusConfig = getStatusConfig(sprint.status);
  const StatusIcon = statusConfig.icon;

  // Calculate days remaining
  const endDate = new Date(sprint.endDate.replace(/(\w+), (\w+ \d+), (\d+)/, "$2, $3"));
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="border-2 border-[var(--color-border)] p-8 md:p-12">
      <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
        {/* Left Content */}
        <div>
          {/* Status Badge */}
          <Badge variant={statusConfig.variant} size="md" className="mb-8">
            <StatusIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
            {statusConfig.text}
          </Badge>

          {/* Block Title */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-4">
              <span
                className="text-7xl md:text-9xl tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
              >
                {sprint.blockNumber.toString().padStart(2, "0")}
              </span>
              <div>
                <h1
                  className="text-2xl md:text-3xl tracking-tight capitalize italic"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {sprint.blockLabel.split("-")[1] || sprint.blockLabel}
                </h1>
              </div>
            </div>
            <p className="text-xl md:text-2xl leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {sprint.theme}
            </p>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="border border-[var(--color-border)] px-4 py-2">
              <span className="text-sm uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)" }}>
                {sprint.startDate} → {sprint.endDate}
              </span>
            </div>
            {daysRemaining > 0 && (
              <div className="bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] px-4 py-2">
                <span className="text-sm uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)" }}>
                  {daysRemaining} {daysRemaining === 1 ? "Day" : "Days"} Left
                </span>
              </div>
            )}
          </div>

          {/* Goal */}
          <p className="text-base leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
            {sprint.goal}
          </p>
        </div>

        {/* Progress Box */}
        <div className="flex flex-col items-center border-2 border-[var(--color-border)] p-8 min-w-[200px]">
          <div className="text-center mb-6">
            <div
              className="text-6xl tracking-tighter mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
            >
              {progress}%
            </div>
            <div className="text-sm uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)" }}>
              Complete
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 border border-[var(--color-border)] mb-6">
            <div
              className="h-full bg-[var(--color-foreground)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Task count */}
          <div className="text-center">
            <div
              className="text-2xl mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              {sprint.outcome.tasksCompleted}/{sprint.outcome.tasksPlanned}
            </div>
            <div className="text-sm uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)" }}>
              Tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

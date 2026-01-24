"use client";

import { useState } from "react";
import { Zap, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/chunes/ui/Badge";
import type { PlannedBlock, SprintTask } from "@/lib/chunes/sprint-parser";

// Block name lookup
const BLOCK_NAMES: Record<number, string> = {
  1: "Bach",
  2: "Miles",
  3: "Jimi",
  4: "Ella",
  5: "Duke",
  6: "Nina",
};

interface SprintTimelineProps {
  blocks: PlannedBlock[];
  currentBlockNumber: number;
  currentTasks: SprintTask[];
}

interface TimelineNode {
  number: number;
  name: string;
  focus: string;
  dates: string;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  tasks: SprintTask[];
}

export function SprintTimeline({ blocks, currentBlockNumber, currentTasks }: SprintTimelineProps) {
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);

  // Build timeline nodes
  const nodes: TimelineNode[] = blocks.map((block) => {
    return {
      number: block.number,
      name: BLOCK_NAMES[block.number] || block.name,
      focus: block.focus,
      dates: block.dates,
      isCurrent: block.number === currentBlockNumber,
      isPast: block.number < currentBlockNumber,
      isFuture: block.number > currentBlockNumber,
      tasks: block.number === currentBlockNumber ? currentTasks : block.tasks,
    };
  });

  const selectedNode = nodes.find((n) => n.number === selectedBlock);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2
            className="text-4xl md:text-5xl tracking-tighter mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
          >
            What&apos;s Coming Next
          </h2>
          <p className="text-base" style={{ fontFamily: "var(--font-body)" }}>
            Select a block to see its planned tasks
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t-2 border-l-2 border-[var(--color-border)] mb-8">
          {nodes.map((node) => {
            const isSelected = selectedBlock === node.number;

            return (
              <button
                key={node.number}
                onClick={() => setSelectedBlock(isSelected ? null : node.number)}
                className={`
                  relative border-r-2 border-b-2 border-[var(--color-border)] p-6 text-left
                  transition-colors duration-100
                  ${node.isCurrent || node.isPast ? "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)]" : "bg-[var(--color-background)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-accent-foreground)]"}
                  ${isSelected ? "border-[4px]" : ""}
                `}
              >
                {/* Badge */}
                {node.isCurrent && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge variant="accent" size="sm" className="bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]">
                      <Zap className="w-3 h-3" strokeWidth={1.5} />
                    </Badge>
                  </div>
                )}
                {node.isPast && !node.isCurrent && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge variant="success" size="sm" className="bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)]">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={1.5} />
                    </Badge>
                  </div>
                )}

                {/* Content */}
                <div
                  className="text-4xl md:text-5xl mb-2 tracking-tighter"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
                >
                  {node.number.toString().padStart(2, "0")}
                </div>
                <div
                  className="text-sm uppercase tracking-[0.1em] mb-1 italic"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {node.name}
                </div>
                <div
                  className="text-xs uppercase tracking-[0.1em] opacity-70"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {node.dates.split(",")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Block Tasks Panel */}
        {selectedNode && (
          <div className="border-2 border-[var(--color-border)] p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3
                  className="text-2xl mb-2 tracking-tight"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  Block {selectedNode.number}: {selectedNode.name}
                </h3>
                <p className="text-base mb-2" style={{ fontFamily: "var(--font-body)" }}>
                  {selectedNode.focus}
                </p>
                <p className="text-sm uppercase tracking-[0.1em] opacity-70" style={{ fontFamily: "var(--font-mono)" }}>
                  {selectedNode.dates}
                </p>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="p-2 border border-[var(--color-border)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-accent-foreground)] transition-colors duration-100"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {selectedNode.tasks.length > 0 ? (
              <div className="grid gap-0 border-t-2 border-l-2 border-[var(--color-border)]">
                {selectedNode.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-r-2 border-b-2 border-[var(--color-border)]"
                  >
                    <code
                      className="text-xs px-2 py-1 border border-[var(--color-border)] bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] w-fit"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {task.id}
                    </code>
                    <span className="text-sm flex-1" style={{ fontFamily: "var(--font-body)" }}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                {selectedNode.isPast ? "No task history available" : "No tasks planned yet"}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

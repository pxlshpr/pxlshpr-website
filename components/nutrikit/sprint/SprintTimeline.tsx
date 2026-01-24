'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SprintConfig, SprintInfo, SprintTask, PlannedSprint, CompletedSprint, getSprintName } from '@/lib/nutrikit/sprint-parser';

// Block number offset (adjusts display number from file number)
const BLOCK_OFFSET = 0;

interface SprintTimelineProps {
  currentSprint: SprintInfo;
  config: SprintConfig;
  currentTasks: SprintTask[];
  plannedSprints?: PlannedSprint[];
  completedSprints?: CompletedSprint[];
}

interface TimelineNode {
  sprint: number;
  displayNumber: number;
  name: string;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  tasks: SprintTask[];
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
}

// Parse date range string like "Thu Jan 8 - Sat Jan 10, 2026" or "Sat, Jan 4, 2026"
function parseDateRange(dateRange: string): { start: Date; end: Date } | null {
  try {
    // Handle range format: "Thu Jan 8 - Sat Jan 10, 2026"
    if (dateRange.includes(' - ')) {
      const [startPart, endPart] = dateRange.split(' - ');
      const yearMatch = endPart.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();

      // Parse start date (e.g., "Thu Jan 8")
      const startMatch = startPart.match(/(\w+)\s+(\d+)/);
      if (!startMatch) return null;
      const startMonthDay = `${startMatch[1]} ${startMatch[2]}, ${year}`;

      // Parse end date (e.g., "Sat Jan 10, 2026")
      const endClean = endPart.replace(/^\w+\s+/, ''); // Remove day name

      return {
        start: new Date(startMonthDay),
        end: new Date(endClean)
      };
    }

    // Handle single date format: "Sat, Jan 4, 2026"
    const singleDate = new Date(dateRange);
    if (!isNaN(singleDate.getTime())) {
      // Default to 3-day block
      const endDate = new Date(singleDate);
      endDate.setDate(endDate.getDate() + 2);
      return { start: singleDate, end: endDate };
    }

    return null;
  } catch {
    return null;
  }
}

// Parse SprintInfo dates
function parseSprintInfoDates(startDate: string, endDate: string): { start: Date; end: Date } | null {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return { start, end };
    }
    return null;
  } catch {
    return null;
  }
}

// Format date to short display (Jan 8)
function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format date for timeline header - only show month on first occurrence
function formatDateForHeader(date: Date, prevDate: Date | null): { label: string; showMonth: boolean } {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });

  // Show month if it's the first date or if month changed from previous
  const showMonth = !prevDate || prevDate.getMonth() !== date.getMonth();

  return {
    label: showMonth ? `${month} ${day}` : `${day}`,
    showMonth
  };
}

// Format date to full display (Thu, Jan 8)
function formatDateFull(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Build task map and date map from completed, current, and planned sprints
function buildSprintMaps(
  currentSprintNum: number,
  currentTasks: SprintTask[],
  plannedSprints: PlannedSprint[],
  completedSprints: CompletedSprint[] = []
): { taskMap: Map<number, SprintTask[]>, dateMap: Map<number, string> } {
  const taskMap = new Map<number, SprintTask[]>();
  const dateMap = new Map<number, string>();

  // Add completed sprints first
  for (const completed of completedSprints) {
    taskMap.set(completed.number, completed.tasks);
    dateMap.set(completed.number, completed.dateRange);
  }

  // Add current sprint
  taskMap.set(currentSprintNum, currentTasks);

  // Add planned sprints
  for (const planned of plannedSprints) {
    taskMap.set(planned.number, planned.tasks);
    dateMap.set(planned.number, planned.dateRange);
  }

  return { taskMap, dateMap };
}

export default function SprintTimeline({ currentSprint, currentTasks, plannedSprints = [], completedSprints = [] }: SprintTimelineProps) {
  const currentSprintNum = currentSprint.number;
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { taskMap: sprintTaskMap, dateMap: sprintDateMap } = buildSprintMaps(currentSprintNum, currentTasks, plannedSprints, completedSprints);

  // Generate timeline nodes with date information
  const nodes: TimelineNode[] = useMemo(() => {
    // Calculate min and max sprint numbers
    const minPastSprint = completedSprints.length > 0
      ? Math.min(...completedSprints.map(s => s.number))
      : currentSprintNum;

    const maxFutureSprint = Math.max(
      currentSprintNum + 4,
      ...Array.from(sprintTaskMap.keys())
    );

    const result: TimelineNode[] = [];

    for (let i = minPastSprint; i <= maxFutureSprint; i++) {
      const displayNumber = i + BLOCK_OFFSET;
      const dateRange = sprintDateMap.get(i);

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      // For current sprint, use SprintInfo dates
      if (i === currentSprintNum) {
        const dates = parseSprintInfoDates(currentSprint.startDate, currentSprint.endDate);
        if (dates) {
          startDate = dates.start;
          endDate = dates.end;
        }
      } else if (dateRange) {
        // For planned sprints, parse the date range
        const dates = parseDateRange(dateRange);
        if (dates) {
          startDate = dates.start;
          endDate = dates.end;
        }
      }

      // If no dates yet, estimate based on block number (3 days per block)
      if (!startDate && result.length > 0) {
        const prevNode = result[result.length - 1];
        if (prevNode.endDate) {
          startDate = new Date(prevNode.endDate);
          startDate.setDate(startDate.getDate() + 1);
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 2);
        }
      }

      result.push({
        sprint: i,
        displayNumber,
        name: getSprintName(displayNumber),
        isCurrent: i === currentSprintNum,
        isPast: i < currentSprintNum,
        isFuture: i > currentSprintNum,
        tasks: sprintTaskMap.get(i) || [],
        dateRange,
        startDate,
        endDate,
      });
    }

    return result;
  }, [currentSprintNum, currentSprint.startDate, currentSprint.endDate, sprintTaskMap, sprintDateMap, completedSprints]);

  // Calculate timeline date range for grid
  const { timelineStart, timelineEnd, totalDays } = useMemo(() => {
    let earliest = nodes[0]?.startDate;
    let latest = nodes[nodes.length - 1]?.endDate;

    if (!earliest) earliest = new Date();
    if (!latest) {
      latest = new Date(earliest);
      latest.setDate(latest.getDate() + nodes.length * 3);
    }

    // Add padding
    const start = new Date(earliest);
    start.setDate(start.getDate() - 1);
    const end = new Date(latest);
    end.setDate(end.getDate() + 1);

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return { timelineStart: start, timelineEnd: end, totalDays: days };
  }, [nodes]);

  // Generate date markers for the timeline grid
  const dateMarkers = useMemo(() => {
    const markers: { date: Date; label: string; isWeekend: boolean; showMonth: boolean }[] = [];
    const current = new Date(timelineStart);
    let prevDate: Date | null = null;

    while (current <= timelineEnd) {
      const dayOfWeek = current.getDay();
      const { label, showMonth } = formatDateForHeader(current, prevDate);

      markers.push({
        date: new Date(current),
        label,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        showMonth,
      });

      prevDate = new Date(current);
      current.setDate(current.getDate() + 1);
    }

    return markers;
  }, [timelineStart, timelineEnd]);

  const selectedNode = nodes.find(n => n.sprint === selectedSprint);

  // Calculate position and width for a block on the timeline
  const getBlockPosition = (node: TimelineNode) => {
    if (!node.startDate || !node.endDate) {
      return { left: 0, width: 100 / nodes.length };
    }

    const startOffset = (node.startDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (node.endDate.getTime() - node.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100,
    };
  };

  // Check scroll state
  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    updateScrollState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);

      return () => {
        container.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [nodes.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">What's Coming Next</h2>
          <p className="text-muted text-sm">Tap a block to see its planned tasks</p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? 'glass-strong hover:bg-white/10 cursor-pointer opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? 'glass-strong hover:bg-white/10 cursor-pointer opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Fade edges */}
          <div className={`absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          {/* Scrollable Timeline */}
          <div
            ref={scrollContainerRef}
            className="relative overflow-x-auto px-12 pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Gantt Chart Container */}
            <div
              className="relative"
              style={{ minWidth: `${Math.max(totalDays * 48, 600)}px` }}
            >
              {/* Date Header Row */}
              <div className="relative h-8 mb-4">
                {dateMarkers.map((marker, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 -translate-x-1/2 py-2"
                    style={{ left: `${(idx / totalDays) * 100}%` }}
                  >
                    <span className={`text-[11px] font-mono px-1 py-0.5 rounded-md transition-colors whitespace-nowrap ${
                      marker.isWeekend
                        ? 'bg-foreground/8 text-muted-foreground'
                        : 'bg-foreground/5 text-muted'
                    } ${marker.showMonth ? 'font-medium' : ''}`}>
                      {marker.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Vertical Grid Lines - extremely subtle gray */}
              <div className="absolute top-14 bottom-40 left-0 right-0 pointer-events-none">
                {dateMarkers.map((marker, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-px bg-gray-500/[0.08]"
                    style={{ left: `${(idx / totalDays) * 100}%` }}
                  />
                ))}
              </div>

              {/* Today Indicator */}
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (today >= timelineStart && today <= timelineEnd) {
                  const position = ((today.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
                  return (
                    <div
                      className="absolute top-14 bottom-10 w-0.5 bg-orange-500/80 z-5 pointer-events-none"
                      style={{ left: `${position}%` }}
                    >
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-lg">
                        TODAY
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Block Bars Track */}
              <div className="relative h-28 mt-4">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(249, 115, 22, 0.6)" />
                      <stop offset="100%" stopColor="rgba(160, 99, 255, 0.3)" />
                    </linearGradient>
                  </defs>
                  {nodes.slice(0, -1).map((node, idx) => {
                    const nextNode = nodes[idx + 1];
                    const pos = getBlockPosition(node);
                    const nextPos = getBlockPosition(nextNode);

                    const x1 = pos.left + pos.width;
                    const x2 = nextPos.left;

                    const isConnected = selectedSprint === null || selectedSprint === node.sprint || selectedSprint === nextNode.sprint;

                    return (
                      <line
                        key={idx}
                        x1={`${x1}%`}
                        y1="50%"
                        x2={`${x2}%`}
                        y2="50%"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        strokeDasharray={node.isCurrent || nextNode.isCurrent ? "none" : "4 4"}
                        className="transition-all duration-500"
                        style={{
                          filter: isConnected ? 'none' : 'saturate(0.5) brightness(0.6)',
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Block Bars */}
                {nodes.map((node) => {
                  const pos = getBlockPosition(node);
                  const isSelected = selectedSprint === node.sprint;

                  return (
                    <button
                      key={node.sprint}
                      onClick={() => {
                        // Toggle selection - tap again to deselect
                        if (isSelected) {
                          setSelectedSprint(null);
                        } else {
                          setSelectedSprint(node.sprint);
                        }
                      }}
                      className={`absolute top-1/2 -translate-y-1/2 h-16 rounded-xl transition-[transform,filter,opacity] duration-300 ease-out cursor-pointer group
                        ${isSelected
                          ? 'z-20 scale-105'
                          : 'z-10 hover:scale-[1.02]'
                        }
                        ${selectedSprint !== null && !isSelected ? 'saturate-50 brightness-75' : ''}
                      `}
                      style={{
                        left: `calc(${pos.left}% + 2px)`,
                        width: `calc(${Math.max(pos.width, 3)}% - 4px)`,
                        minWidth: '76px',
                      }}
                    >
                      {/* Block Background - Glass effect */}
                      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                        node.isCurrent
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 border border-orange-400/50'
                          : node.isPast
                            ? 'bg-success shadow-md border border-success/50'
                            : isSelected
                              ? 'glass-strong'
                              : 'glass'
                      }`}>
                        {/* Animated glow for current */}
                        {node.isCurrent && (
                          <div className="absolute inset-0 rounded-xl bg-orange-500/30 animate-pulse" />
                        )}
                      </div>

                      {/* Block Content */}
                      <div className="relative h-full flex flex-col items-center justify-center px-2">
                        {/* Block Number & Name */}
                        <div className={`font-bold text-sm ${
                          node.isCurrent || node.isPast ? 'text-white' : 'text-foreground/80'
                        }`}>
                          {node.displayNumber}
                        </div>
                        <div className={`text-xs font-mono capitalize truncate max-w-full ${
                          node.isCurrent ? 'text-white/90' : node.isPast ? 'text-white/80' : 'text-foreground/60'
                        }`}>
                          {node.name}
                        </div>

                        {/* Status Label */}
                        <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap transition-opacity duration-300 ${
                          isSelected || node.isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        } ${
                          node.isCurrent ? 'text-orange-400' : node.isPast ? 'text-success' : 'text-foreground/50'
                        }`}>
                          {node.isCurrent ? 'active' : node.isPast ? 'done' : 'planned'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Date Range Labels (below blocks) */}
              <div className="relative h-10 mt-4 z-20">
                {nodes.map((node) => {
                  const pos = getBlockPosition(node);
                  const isSelected = selectedSprint === node.sprint;

                  return (
                    <div
                      key={node.sprint}
                      className={`absolute flex justify-center transition-all duration-300 ${
                        isSelected || (node.isCurrent && selectedSprint === null)
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                      style={{
                        left: `${pos.left}%`,
                        width: `${Math.max(pos.width, 3)}%`,
                        minWidth: '80px',
                      }}
                    >
                      {node.startDate && node.endDate && (
                        <span className={`text-[10px] font-mono px-2 py-1 rounded-lg glass-strong whitespace-nowrap ${
                          node.isCurrent
                            ? isSelected ? 'text-orange-500' : 'text-orange-400/60'
                            : 'text-foreground/70'
                        }`}>
                          {formatDateFull(node.startDate)} - {formatDateFull(node.endDate)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Sprint Tasks Panel - only renders when a block is selected */}
        {selectedNode && (
          <div className="mt-8">
            <div className="glass rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    Block {selectedNode.displayNumber}:{' '}
                    <span className="inline-block bg-accent/20 rounded-2xl px-3 py-1 gradient-text font-mono">
                      {selectedNode.name}
                    </span>
                  </h3>
                  <div className="text-sm text-muted space-y-1">
                    <p>{selectedNode.isCurrent ? 'Current block' : selectedNode.isPast ? 'Completed block' : 'Planned tasks (tentative)'}</p>
                    {selectedNode.startDate && selectedNode.endDate && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {formatDateFull(selectedNode.startDate)} - {formatDateFull(selectedNode.endDate)}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSprint(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedNode.tasks.length > 0 ? (
                <div className="space-y-2">
                  {selectedNode.tasks.map((task, idx) => (
                    <Link
                      key={task.id}
                      href={`/block/task/${task.id}`}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 glass-subtle rounded-xl hover:bg-white/10 transition-all duration-200 animate-in fade-in slide-in-from-left-2"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="text-xs font-mono text-accent flex-shrink-0">{task.id}</span>
                      <span className="flex-1 min-w-0 w-full sm:w-auto break-words">{task.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm text-center py-4">
                  {selectedNode.isPast ? 'No task history available' : 'No tasks planned yet'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/*
LEGACY: Mobile-Friendly Circle View - Replaced by responsive Gantt chart
This code is preserved for reference but no longer used.

<div className="md:hidden mt-8">
  <div className="flex overflow-x-auto gap-4 pb-4 px-4 scrollbar-hide snap-x snap-mandatory">
    {nodes.map((node) => {
      const isSelected = selectedSprint === node.sprint;

      return (
        <button
          key={node.sprint}
          onClick={() => setSelectedSprint(isSelected ? null : node.sprint)}
          className={`flex-shrink-0 snap-center flex flex-col items-center transition-all duration-300 ${
            isSelected ? 'scale-110' : ''
          }`}
        >
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                : ''
            } ${
              node.isCurrent
                ? 'bg-orange-500 shadow-lg shadow-orange-500/40'
                : node.isPast
                  ? 'bg-success'
                  : 'bg-transparent border-2 border-dashed border-foreground/30'
            }`}
          >
            <span className={`font-bold ${
              node.isCurrent || node.isPast ? 'text-white' : 'text-foreground/60'
            }`}>
              {node.displayNumber}
            </span>

            {node.isCurrent && (
              <div className="absolute inset-0 rounded-full bg-orange-500/40 animate-ping" />
            )}
          </div>

          <div className="mt-2 text-center">
            <div className={`text-xs font-mono capitalize ${
              node.isCurrent ? 'text-orange-400' : node.isPast ? 'text-success' : 'text-foreground/50'
            }`}>
              {node.name}
            </div>
            {node.startDate && (
              <div className="text-[10px] text-muted-foreground">
                {formatDateShort(node.startDate)}
              </div>
            )}
          </div>
        </button>
      );
    })}
  </div>
</div>
*/

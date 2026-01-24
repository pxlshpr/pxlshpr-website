'use client';

import { useState } from 'react';
import { DailyLogEntry } from '@/lib/nutrikit/sprint-parser';
import Link from 'next/link';

interface DailyLogProps {
  entries: DailyLogEntry[];
}

function DayCard({ entry, isExpanded, onToggle }: {
  entry: DailyLogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Don't count eodSummary as content since completed tasks from Linear replaces it
  const hasContent = entry.morningStandup || entry.midDayCheckIn || entry.buildSubmitted || (entry.completedTasks && entry.completedTasks.length > 0);

  // Determine day status
  const today = new Date();
  const entryDate = new Date(entry.date + ', 2026');
  const isToday = today.toDateString() === entryDate.toDateString();
  const isPast = entryDate < today && !isToday;
  const isFuture = entryDate > today;

  return (
    <div
      className={`
        glass border-2 rounded-none overflow-hidden transition-all duration-300
        ${isToday ? 'border-primary/60 shadow-glow-magenta' : 'border-primary/20'}
        ${isFuture ? 'opacity-50' : ''}
      `}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Day number badge - Terminal style */}
          <div className={`
            w-10 h-10 rounded-none border-2 flex items-center justify-center text-lg font-heading font-bold transform -skew-x-6
            ${isToday
              ? 'bg-primary/20 text-primary border-primary/60'
              : isPast
                ? hasContent ? 'bg-secondary/10 text-secondary border-secondary/40' : 'bg-white/5 text-foreground/40 border-border-default'
                : 'bg-white/5 text-foreground/40 border-border-default'
            }
          `}>
            <span className="skew-x-6">{entry.day}</span>
          </div>

          {/* Day info */}
          <div>
            <div className="font-mono font-medium flex items-center gap-2">
              Day {entry.day}
              {isToday && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-primary/10 text-primary text-xs border border-primary/40 transform -skew-x-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse skew-x-6" />
                  <span className="skew-x-6 uppercase tracking-wider">Today</span>
                </span>
              )}
            </div>
            <div className="text-sm font-mono text-foreground/60">
              {entry.dayName}, {entry.date}
            </div>
          </div>
        </div>

        {/* Status indicator & expand arrow */}
        <div className="flex items-center gap-3">
          {hasContent && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
              {entry.morningStandup && (
                <span className="px-2 py-0.5 rounded-none bg-white/10 border border-white/20 text-foreground/70 uppercase tracking-wider transform -skew-x-6">
                  <span className="inline-block skew-x-6">AM</span>
                </span>
              )}
              {entry.completedTasks && entry.completedTasks.length > 0 && (
                <span className="px-2 py-0.5 rounded-none bg-secondary/10 border border-secondary/40 text-secondary uppercase tracking-wider transform -skew-x-6">
                  <span className="inline-block skew-x-6">{entry.completedTasks.length} done</span>
                </span>
              )}
              {entry.buildSubmitted && (
                <span className="px-2 py-0.5 rounded-none bg-tertiary/10 border border-tertiary/40 text-tertiary uppercase tracking-wider transform -skew-x-6">
                  <span className="inline-block skew-x-6">Build</span>
                </span>
              )}
            </div>
          )}

          <svg
            className={`w-5 h-5 text-secondary/70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? 'max-h-[600px]' : 'max-h-0'}
        `}
      >
        <div className="px-4 pb-4 space-y-3">
          {/* Completed Tasks Checklist - Terminal style */}
          {entry.completedTasks && entry.completedTasks.length > 0 && (
            <div className="bg-black/30 border-2 border-secondary/30 p-3 rounded-none">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-3 text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                &gt; Completed Tasks ({entry.completedTasks.length})
              </div>
              <div className="space-y-2">
                {entry.completedTasks.map((task) => (
                  <TaskChecklistItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {entry.morningStandup && (
            <LogEntry
              label="Morning Standup"
              content={entry.morningStandup}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
          )}

          {entry.midDayCheckIn && (
            <LogEntry
              label="Mid-day Check-in"
              content={entry.midDayCheckIn}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          )}

          {/* EOD Summary removed - Completed Tasks from Linear replaces it */}

          {entry.buildSubmitted && (
            <LogEntry
              label="Build Submitted"
              content={entry.buildSubmitted}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              }
              highlight
            />
          )}

          {!hasContent && (
            <div className="text-sm text-muted-foreground italic py-2">
              No log entries for this day yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskChecklistItem({ task }: { task: { id: string; identifier: string; title: string; completedAt: string; url: string; priority: number } }) {
  const completedTime = new Date(task.completedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Link
      href={`/block/task/${task.identifier}`}
      className="flex items-start gap-3 p-3 rounded-none border-l-2 border-secondary/40 bg-black/20 hover:bg-black/40 hover:border-secondary transition-all duration-200 group"
    >
      {/* Checkmark icon - Vaporwave style */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-5 h-5 rounded-full border-2 border-secondary/40 bg-secondary/10 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/20 transition-all">
          <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-secondary/70 uppercase tracking-wider">{task.identifier}</span>
          <span className="text-xs font-mono text-foreground/40">{completedTime}</span>
        </div>
        <p className="text-sm font-mono text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
          {task.title}
        </p>
      </div>

      {/* Chevron indicator - appears on hover */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function LogEntry({ label, content, icon, highlight }: {
  label: string;
  content: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`
      p-3 rounded-xl
      ${highlight ? 'bg-success/10 border border-success/20' : 'bg-white/5'}
    `}>
      <div className={`flex items-center gap-2 text-xs font-medium mb-1 ${highlight ? 'text-success' : 'text-muted'}`}>
        {icon}
        {label}
      </div>
      <p className="text-sm text-foreground/90">{content}</p>
    </div>
  );
}

export default function DailyLog({ entries }: DailyLogProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Auto-expand today or the first day with content
  const today = new Date();
  const todayEntry = entries.find(e => {
    const entryDate = new Date(e.date + ', 2026');
    return today.toDateString() === entryDate.toDateString();
  });

  const defaultExpanded = todayEntry?.day || entries.find(e =>
    e.morningStandup || e.eodSummary || e.midDayCheckIn || e.buildSubmitted
  )?.day || null;

  const handleToggle = (day: number) => {
    setExpandedDay(prev => prev === day ? null : day);
  };

  return (
    <section className="section-padding">
      <div className="container-vaporwave">
        {/* Section header - Terminal style */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-bold text-glow-cyan">
            &gt; Daily Updates
          </h2>
          <span className="text-sm font-mono uppercase tracking-wider text-secondary/70">
            {entries.length} days
          </span>
        </div>

        {/* Day cards */}
        <div className="space-y-3">
          {entries.map((entry) => (
            <DayCard
              key={entry.day}
              entry={entry}
              isExpanded={expandedDay === entry.day || (expandedDay === null && entry.day === defaultExpanded)}
              onToggle={() => handleToggle(entry.day)}
            />
          ))}
        </div>

        {/* Empty state - Terminal window */}
        {entries.length === 0 && (
          <div className="terminal-window max-w-md mx-auto">
            <div className="terminal-title-bar">
              <div className="terminal-dots">
                <div className="terminal-dot-magenta" />
                <div className="terminal-dot-cyan" />
                <div className="terminal-dot-orange" />
              </div>
              <span className="text-xs font-mono uppercase text-secondary/70">
                Daily Log
              </span>
            </div>
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📔</div>
              <h3 className="font-heading text-lg font-bold mb-2 text-glow-cyan">No Logs Yet</h3>
              <p className="font-mono text-foreground/60 text-sm">
                &gt; Daily standups will appear here...
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

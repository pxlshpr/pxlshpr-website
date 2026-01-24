'use client';

import Link from 'next/link';
import { SprintTask } from '@/lib/nutrikit/sprint-parser';

interface TaskBoardProps {
  tasks: SprintTask[];
}

// Display names for statuses
function getStatusDisplayName(status: SprintTask['status']): string {
  const statusMap: Record<SprintTask['status'], string> = {
    'Ready': 'Ready to Start',
    'Running': 'Working On It',
    'Testing': 'Being Tested',
    'Done': 'Completed',
    'Backlog': 'Backlog',
    'Todo': 'To Do',
    'Queue': 'Queued',
    'Canceled': 'Canceled',
  };
  return statusMap[status] || status;
}

function StatusIcon({ status }: { status: SprintTask['status'] }) {
  switch (status) {
    case 'Done':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'Running':
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'Testing':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'Ready':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      );
  }
}

function TaskCard({ task }: { task: SprintTask }) {
  const isDone = task.status === 'Done';
  const isRunning = task.status === 'Running';
  const isTesting = task.status === 'Testing';

  return (
    <Link
      href={`/block/task/${task.id}`}
      className={`
        block glass border-2 rounded-none p-5 relative overflow-hidden
        transition-all duration-200 cursor-pointer
        ${isRunning ? 'border-secondary/60 shadow-glow-cyan' : ''}
        ${isTesting ? 'border-tertiary/50 hover:border-tertiary/70 hover:shadow-glow-orange' : ''}
        ${isDone ? 'border-secondary/30 bg-black/30 opacity-70 hover:opacity-90' : 'border-primary/20 hover:border-secondary/50 hover:shadow-glow-cyan'}
      `}
    >
      {/* Status indicator bars */}
      {isRunning && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary animate-shimmer" />
      )}
      {isTesting && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary via-primary to-tertiary animate-shimmer" />
      )}
      {isDone && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary/50 to-secondary/20" />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Task info */}
        <div className="flex-1 min-w-0">
          {/* Task ID - Terminal style with status indicator */}
          <div className="flex items-center gap-2 mb-2">
            {isDone && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-secondary/10 border border-secondary/40 transform -skew-x-6">
                <svg className="w-3 h-3 text-secondary skew-x-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary skew-x-6">
                  Done
                </span>
              </span>
            )}
            <span className={`text-xs font-mono uppercase tracking-wider ${isDone ? 'text-secondary/40' : 'text-secondary/70'}`}>
              {task.id}
            </span>
          </div>

          {/* Task title - Monospace with strikethrough for done */}
          <h3 className={`font-mono text-base leading-relaxed ${isDone ? 'line-through text-foreground/50' : 'text-foreground'}`}>
            {task.title}
          </h3>
        </div>

        {/* Status icon on the right */}
        {isDone && (
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-secondary/30 rounded-full bg-secondary/5">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Chevron indicator - Only show if not done */}
      {!isDone && (
        <div className="absolute bottom-2 right-2 text-secondary/30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </Link>
  );
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
  // Group tasks by status for summary
  const statusGroups = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort tasks: Running first, then by priority, then alphabetically
  const sortedTasks = [...tasks].sort((a, b) => {
    // Running tasks first
    if (a.status === 'Running' && b.status !== 'Running') return -1;
    if (b.status === 'Running' && a.status !== 'Running') return 1;

    // Done tasks last
    if (a.status === 'Done' && b.status !== 'Done') return 1;
    if (b.status === 'Done' && a.status !== 'Done') return -1;

    // Then by priority
    const priorityOrder: Record<string, number> = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'None': 4 };
    const priorityDiff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    if (priorityDiff !== 0) return priorityDiff;

    // Then alphabetically
    return a.title.localeCompare(b.title);
  });

  return (
    <section className="section-padding">
      <div className="container-vaporwave">
        {/* Section header - Terminal style */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="font-heading text-3xl font-bold text-glow-cyan">
            &gt; What's in This Build
          </h2>

          {/* Status summary badges - Vaporwave style */}
          <div className="flex flex-wrap items-center gap-2">
            {statusGroups['Running'] && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider bg-secondary/10 text-secondary border-2 border-secondary/40 transform -skew-x-6">
                <span className="relative flex h-2 w-2 skew-x-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="skew-x-6">
                  {statusGroups['Running']} Working
                </span>
              </span>
            )}
            {statusGroups['Ready'] && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary border-2 border-primary/40 transform -skew-x-6">
                <span className="skew-x-6">
                  {statusGroups['Ready']} Ready
                </span>
              </span>
            )}
            {statusGroups['Testing'] && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider bg-tertiary/10 text-tertiary border-2 border-tertiary/40 transform -skew-x-6">
                <span className="skew-x-6">
                  {statusGroups['Testing']} Testing
                </span>
              </span>
            )}
            {statusGroups['Done'] && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider bg-secondary/10 text-secondary border-2 border-secondary/40 transform -skew-x-6">
                <span className="skew-x-6">
                  {statusGroups['Done']} Done
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Task cards grid */}
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Empty state - Terminal window */}
        {tasks.length === 0 && (
          <div className="terminal-window max-w-md mx-auto">
            <div className="terminal-title-bar">
              <div className="terminal-dots">
                <div className="terminal-dot-magenta" />
                <div className="terminal-dot-cyan" />
                <div className="terminal-dot-orange" />
              </div>
              <span className="text-xs font-mono uppercase text-secondary/70">
                Tasks
              </span>
            </div>
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-heading text-lg font-bold mb-2 text-glow-cyan">No Tasks Yet</h3>
              <p className="font-mono text-foreground/60 text-sm">
                &gt; Awaiting sprint planning...
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

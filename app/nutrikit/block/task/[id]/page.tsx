import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchTaskDetails, getStatusColorClass, getPriorityColorClass } from '@/lib/nutrikit/linear-client';
import { fetchSprintTaskList, type SprintTask } from '@/lib/nutrikit/sprint-parser';
import MarkdownRenderer from '@/components/nutrikit/sprint/MarkdownRenderer';
import DescriptionSections from '@/components/nutrikit/sprint/DescriptionSections';
import { parseDescription } from '@/lib/nutrikit/parse-description';
import TerminalSection from '@/components/nutrikit/terminal/TerminalSection';
import VaporwaveBackground from '@/components/nutrikit/backgrounds/VaporwaveBackground';
import { Button } from '@/components/nutrikit/ui';

// Revalidate every 2 minutes for task details
export const revalidate = 120;

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TaskPageProps) {
  const { id } = await params;
  return {
    title: `${id} - Sprint Dashboard - NutriKit`,
    description: `View details for task ${id}`,
  };
}

interface TaskNavInfo {
  prevTask: SprintTask | null;
  nextTask: SprintTask | null;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  let task;
  let error = null;
  let navInfo: TaskNavInfo = { prevTask: null, nextTask: null };

  try {
    // Fetch task details and sprint task list in parallel
    const [taskDetails, sprintTasks] = await Promise.all([
      fetchTaskDetails(id),
      fetchSprintTaskList(),
    ]);

    task = taskDetails;
    if (!task) {
      notFound();
    }

    // Find current task's position and get prev/next tasks
    const currentIndex = sprintTasks.findIndex(t => t.id === id);
    if (currentIndex !== -1) {
      navInfo = {
        prevTask: currentIndex > 0 ? sprintTasks[currentIndex - 1] : null,
        nextTask: currentIndex < sprintTasks.length - 1 ? sprintTasks[currentIndex + 1] : null,
      };
    }
  } catch (e) {
    console.error('Failed to fetch task:', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Vaporwave Background */}
      <VaporwaveBackground />

      {/* Navigation - Terminal chrome */}
      <header className="glass header-safe-area border-b border-primary/20">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="font-heading text-2xl font-bold text-glow-cyan">
              NUTRIKIT
            </Link>
            <div className="hidden md:flex items-center gap-8 font-mono">
              <Link href="/" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                &gt; Home
              </Link>
              <Link href="/block" className="text-sm text-secondary">
                &gt; Blocks
              </Link>
            </div>
            <Link
              href="https://apps.apple.com/app/nutrikit"
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download
            </Link>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" style={{ height: `calc(5rem + env(safe-area-inset-top, 0px))` }} />

      <main className="flex-1">
        {error ? (
          <ErrorState error={error} taskId={id} />
        ) : task ? (
          <TaskDetailContent task={task} navInfo={navInfo} />
        ) : (
          <LoadingState />
        )}
      </main>

      {/* Footer - Terminal style */}
      <footer className="pt-8 pb-12 relative z-10">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 text-center">
          <span className="text-primary">[</span> &copy; {new Date().getFullYear()} NutriKit <span className="text-primary">]</span> <span className="text-secondary mx-2">|</span> All rights reserved
        </p>
      </footer>
    </div>
  );
}

function TaskDetailContent({ task, navInfo }: {
  task: NonNullable<Awaited<ReturnType<typeof fetchTaskDetails>>>;
  navInfo: TaskNavInfo;
}) {
  const statusColor = getStatusColorClass(task.status);
  const priorityColor = getPriorityColorClass(task.priority);
  const parsedDescription = task.description ? parseDescription(task.description) : null;

  return (
    <div className="py-8 md:py-12 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link - Terminal style */}
        <Link
          href="/block"
          className="inline-flex items-center gap-2 text-sm font-mono text-secondary hover:text-primary transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blocks
        </Link>

        {/* Live Terminal - shows viewer for guests, full terminal for allowed users */}
        <TerminalSection taskIdentifier={task.identifier} taskTitle={task.title} />

        {/* Task Header - Terminal window */}
        <div className="terminal-window mb-6">
          <div className="terminal-title-bar">
            <div className="terminal-dots">
              <div className="terminal-dot-magenta" />
              <div className="terminal-dot-cyan" />
              <div className="terminal-dot-orange" />
            </div>
            <span className="text-xs font-mono uppercase text-secondary/70">
              Task Details
            </span>
          </div>

          <div className="p-6 md:p-8">
            {/* Identifier and badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-secondary text-lg font-bold">{task.identifier}</span>
              <span className={`badge ${statusColor}`}>
                {task.status}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityColor}`}>
                <PriorityDots priority={task.priority} />
                {task.priorityLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-glow-cyan">{task.title}</h1>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono">
              {task.assignee && (
                <div>
                  <span className="text-foreground/50 block mb-1 uppercase text-xs tracking-wider">Assignee</span>
                  <div className="flex items-center gap-2">
                    {task.assignee.avatarUrl && (
                      <img
                        src={task.assignee.avatarUrl}
                        alt={task.assignee.name}
                        className="w-5 h-5 rounded-full border border-secondary/40"
                      />
                    )}
                    <span className="font-medium text-foreground">{task.assignee.name}</span>
                  </div>
                </div>
              )}
              {task.estimate && (
                <div>
                  <span className="text-foreground/50 block mb-1 uppercase text-xs tracking-wider">Estimate</span>
                  <span className="font-medium text-foreground">{task.estimate} points</span>
                </div>
              )}
              {task.dueDate && (
                <div>
                  <span className="text-foreground/50 block mb-1 uppercase text-xs tracking-wider">Due Date</span>
                  <span className="font-medium text-foreground">{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>

            {/* Labels */}
            {task.labels.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <span
                      key={label}
                      className="badge badge-secondary"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preamble */}
            {parsedDescription?.preamble && (
              <div className="mt-4 pt-4 border-t border-primary/20 text-foreground/70">
                <MarkdownRenderer content={parsedDescription.preamble} />
              </div>
            )}
          </div>
        </div>

        {/* Technical Details Header */}
        {parsedDescription?.hasTechnicalDetails && parsedDescription.sections.length > 0 && (
          <h2 className="font-heading text-xl md:text-2xl font-bold text-glow-magenta mb-6 mt-2">
            &gt; Technical Details
          </h2>
        )}

        {/* Description Sections */}
        {task.description && (
          <DescriptionSections content={task.description} taskIdentifier={task.identifier} />
        )}

        {/* Comments */}
        {task.comments.length > 0 && (
          <div className="terminal-window mb-6">
            <div className="terminal-title-bar">
              <div className="terminal-dots">
                <div className="terminal-dot-magenta" />
                <div className="terminal-dot-cyan" />
                <div className="terminal-dot-orange" />
              </div>
              <span className="text-xs font-mono uppercase text-secondary/70">
                Comments ({task.comments.length})
              </span>
            </div>
            <div className="divide-y divide-primary/20">
              {task.comments.map((comment) => (
                <div key={comment.id} className="px-4 py-5 md:px-6 md:py-6">
                  <div className="flex items-center gap-3 mb-3">
                    {comment.user.avatarUrl ? (
                      <img
                        src={comment.user.avatarUrl}
                        alt={comment.user.name}
                        className="w-7 h-7 rounded-full ring-2 ring-secondary/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-medium">
                        {comment.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 flex items-baseline gap-2">
                      <span className="font-mono font-medium text-sm text-foreground">{comment.user.name}</span>
                      <span className="text-xs font-mono text-foreground/40">{formatDateTime(comment.createdAt)}</span>
                    </div>
                  </div>
                  <div className="max-w-none overflow-x-hidden">
                    <MarkdownRenderer content={comment.body} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linear Documents */}
        {task.documents.length > 0 && (
          <div className="terminal-window mb-6">
            <div className="terminal-title-bar">
              <div className="terminal-dots">
                <div className="terminal-dot-magenta" />
                <div className="terminal-dot-cyan" />
                <div className="terminal-dot-orange" />
              </div>
              <span className="text-xs font-mono uppercase text-secondary/70">
                Documentation ({task.documents.length})
              </span>
            </div>
            <div className="p-6 md:p-8 grid gap-3">
              {task.documents.map((document) => (
                <Link
                  key={document.id}
                  href={`/block/task/${task.identifier}/doc/${document.id}`}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-none hover:border-secondary hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 transition-all group transform -skew-x-3"
                >
                  <div className="skew-x-3 w-10 h-10 rounded-none bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors border border-secondary/40">
                    <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 skew-x-3">
                    <span className="text-sm font-mono font-medium block truncate text-foreground">{document.title}</span>
                    <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">View Documentation</span>
                  </div>
                  <svg className="w-4 h-4 text-secondary/50 group-hover:text-secondary transition-colors skew-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments.length > 0 && (
          <div className="terminal-window mb-6">
            <div className="terminal-title-bar">
              <div className="terminal-dots">
                <div className="terminal-dot-magenta" />
                <div className="terminal-dot-cyan" />
                <div className="terminal-dot-orange" />
              </div>
              <span className="text-xs font-mono uppercase text-secondary/70">
                Attachments ({task.attachments.length})
              </span>
            </div>
            <div className="p-6 md:p-8 grid gap-3 sm:grid-cols-2">
              {task.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-black/30 border-2 border-tertiary/20 rounded-none hover:bg-black/50 hover:border-tertiary transition-all group"
                >
                  <div className="w-10 h-10 rounded-none bg-tertiary/20 flex items-center justify-center group-hover:bg-tertiary/30 transition-colors border border-tertiary/40">
                    <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-mono font-medium block truncate text-foreground">{attachment.title}</span>
                    <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">Click to view</span>
                  </div>
                  <svg className="w-4 h-4 text-tertiary/50 group-hover:text-tertiary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-center text-xs font-mono uppercase tracking-wider text-foreground/40 mb-8">
          <span className="text-secondary/60">Created</span> {formatDateTime(task.createdAt)} <span className="text-primary mx-2">{'|'}</span> <span className="text-secondary/60">Updated</span> {formatDateTime(task.updatedAt)}
        </div>

        {/* Task Navigation */}
        {(navInfo.prevTask || navInfo.nextTask) && (
          <TaskNavigation prevTask={navInfo.prevTask} nextTask={navInfo.nextTask} />
        )}
      </div>
    </div>
  );
}

function PriorityDots({ priority }: { priority: number }) {
  const filled = priority === 0 ? 0 : 5 - priority; // 1=Urgent=4 dots, 4=Low=1 dot
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < filled ? 'bg-current' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function TaskNavigation({ prevTask, nextTask }: { prevTask: SprintTask | null; nextTask: SprintTask | null }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Previous Task */}
      {prevTask ? (
        <Link
          href={`/block/task/${prevTask.id}`}
          className="flex-1 group glass border-2 border-primary/20 rounded-none p-4 hover:bg-white/5 hover:border-secondary transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-none bg-black/30 border border-primary/40 flex items-center justify-center group-hover:bg-secondary/20 group-hover:border-secondary transition-colors mt-0.5">
              <svg className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground/50 block mb-1">Previous</span>
              <span className="text-sm font-mono font-medium text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                {prevTask.title}
              </span>
              <span className="text-xs text-secondary/70 font-mono mt-1 block">{prevTask.id}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next Task */}
      {nextTask ? (
        <Link
          href={`/block/task/${nextTask.id}`}
          className="flex-1 group glass border-2 border-primary/20 rounded-none p-4 hover:bg-white/5 hover:border-secondary transition-all"
        >
          <div className="flex items-start gap-3 sm:flex-row-reverse sm:text-right">
            <div className="flex-shrink-0 w-8 h-8 rounded-none bg-black/30 border border-primary/40 flex items-center justify-center group-hover:bg-secondary/20 group-hover:border-secondary transition-colors mt-0.5">
              <svg className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground/50 block mb-1">Next</span>
              <span className="text-sm font-mono font-medium text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                {nextTask.title}
              </span>
              <span className="text-xs text-secondary/70 font-mono mt-1 block">{nextTask.id}</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

function ErrorState({ error, taskId }: { error: string; taskId: string }) {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="terminal-window">
          <div className="terminal-title-bar">
            <div className="terminal-dots">
              <div className="terminal-dot-magenta" />
              <div className="terminal-dot-cyan" />
              <div className="terminal-dot-orange" />
            </div>
            <span className="text-xs font-mono uppercase text-secondary/70">
              Error
            </span>
          </div>
          <div className="p-12">
            <div className="text-6xl mb-6">😅</div>
            <h2 className="font-heading text-2xl font-bold mb-4 text-glow-magenta">Couldn&apos;t load task {taskId}</h2>
            <p className="font-mono text-foreground/70 mb-6">
              &gt; There was an issue fetching the task details.
            </p>
            <code className="block text-sm font-mono text-primary bg-black/50 border border-primary/30 p-4 rounded-none mb-6 overflow-x-auto">
              {error}
            </code>
            <Link href="/block">
              <Button variant="primary" size="lg">
                Back to Blocks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="terminal-window">
          <div className="terminal-title-bar">
            <div className="terminal-dots">
              <div className="terminal-dot-magenta" />
              <div className="terminal-dot-cyan" />
              <div className="terminal-dot-orange" />
            </div>
            <span className="text-xs font-mono uppercase text-secondary/70">
              Loading
            </span>
          </div>
          <div className="p-12">
            <div className="text-6xl mb-6 animate-pulse">⏳</div>
            <h2 className="font-heading text-2xl font-bold mb-4 text-glow-cyan">Loading task details...</h2>
            <p className="font-mono text-foreground/70">&gt; Please wait while we fetch the task information.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

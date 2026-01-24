import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  findTaskById,
  findBlockForTask,
  getAdjacentTasks,
  getStatusColorClass,
  getPriorityColorClass,
  getPriorityNumber,
  type Task,
} from "@/lib/chunes/sprint-data";
import { parseDescription } from "@/lib/chunes/parse-description";
import MarkdownRenderer from "@/components/chunes/sprint/MarkdownRenderer";
import DescriptionSections from "@/components/chunes/sprint/DescriptionSections";
import {
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Revalidate every 2 minutes
export const revalidate = 120;

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TaskPageProps) {
  const { id } = await params;
  const task = findTaskById(id);

  return {
    title: task ? `${id} - ${task.title} - Chunes` : `${id} - Development - Chunes`,
    description: task ? task.title : `View details for task ${id}`,
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  const task = findTaskById(id);
  const blockInfo = findBlockForTask(id);
  const navInfo = getAdjacentTasks(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-app relative">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border-default)]">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/chunes" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src="/chunes/chunes-icon.png"
                  alt="Chunes"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">Chunes</span>
            </Link>

            {/* Back Button */}
            <Link href="/chunes/block" className="btn btn-outline btn-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blocks</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container-app py-8 md:py-12 relative z-10">
        <TaskDetailContent task={task} blockInfo={blockInfo} navInfo={navInfo} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8 relative z-10">
        <div className="container-app text-center">
          <p className="text-sm text-[var(--foreground-tertiary)]">
            &copy; {new Date().getFullYear()} Chunes. Building in public.
          </p>
        </div>
      </footer>
    </div>
  );
}

function TaskDetailContent({
  task,
  blockInfo,
  navInfo,
}: {
  task: Task;
  blockInfo: ReturnType<typeof findBlockForTask>;
  navInfo: ReturnType<typeof getAdjacentTasks>;
}) {
  const statusColor = getStatusColorClass(task.status);
  const priorityColor = getPriorityColorClass(task.priority);
  const priorityNumber = getPriorityNumber(task.priority);
  const parsedDescription = task.description
    ? parseDescription(task.description)
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Task Header */}
      <div className="card p-6 md:p-8 mb-6">
        {/* Block info */}
        {blockInfo && (
          <div className="flex items-center gap-2 mb-4">
            <span className="tag-pill tag-genre text-xs">
              Block {blockInfo.block.number}
            </span>
            <span className="text-xs text-[var(--foreground-tertiary)]">
              {blockInfo.block.focus}
            </span>
            {blockInfo.isCurrent && (
              <span className="tag-pill tag-mood text-xs">Current</span>
            )}
          </div>
        )}

        {/* Identifier and badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-[var(--accent-primary)] text-lg font-bold">
            {task.id}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {task.status}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityColor}`}
          >
            <PriorityDots priority={priorityNumber} />
            {task.priority}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          <span className="gradient-text">{task.title}</span>
        </h1>

        {/* Preamble */}
        {parsedDescription?.preamble && (
          <div className="mt-4 pt-4 border-t border-[var(--border-default)] text-[var(--foreground-secondary)]">
            <MarkdownRenderer content={parsedDescription.preamble} />
          </div>
        )}

        {/* View in Linear */}
        <div className="mt-6 pt-4 border-t border-[var(--border-default)]">
          <a
            href={`https://linear.app/pxlshpr/issue/${task.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View in Linear
          </a>
        </div>
      </div>

      {/* Technical Details Header */}
      {parsedDescription?.hasTechnicalDetails &&
        parsedDescription.sections.length > 0 && (
          <h2 className="text-xl md:text-2xl font-bold mb-6 mt-2">
            <span className="gradient-text">Technical Details</span>
          </h2>
        )}

      {/* Description Sections */}
      {task.description && parsedDescription && parsedDescription.sections.length > 0 && (
        <DescriptionSections
          content={task.description}
          taskIdentifier={task.id}
        />
      )}

      {/* No description message */}
      {!task.description && (
        <div className="card p-8 mb-6 text-center">
          <p className="text-[var(--foreground-secondary)]">
            No detailed description available for this task yet.
          </p>
        </div>
      )}

      {/* Task Navigation */}
      {(navInfo.prevTask || navInfo.nextTask) && (
        <TaskNavigation
          prevTask={navInfo.prevTask}
          nextTask={navInfo.nextTask}
        />
      )}
    </div>
  );
}

function PriorityDots({ priority }: { priority: number }) {
  const filled = priority === 0 ? 0 : 5 - priority;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < filled ? "bg-current" : "bg-[var(--foreground-tertiary)]/30"
          }`}
        />
      ))}
    </div>
  );
}

function TaskNavigation({
  prevTask,
  nextTask,
}: {
  prevTask: Task | null;
  nextTask: Task | null;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Previous Task */}
      {prevTask ? (
        <Link
          href={`/chunes/block/task/${prevTask.id}`}
          className="flex-1 group card-interactive p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center group-hover:bg-[var(--accent-primary)]/20 transition-colors mt-0.5">
              <ChevronLeft className="w-4 h-4 text-[var(--foreground-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs uppercase tracking-wider text-[var(--foreground-tertiary)] block mb-1">
                Previous
              </span>
              <span className="text-sm font-medium group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                {prevTask.title}
              </span>
              <span className="text-xs text-[var(--accent-primary)]/70 font-mono mt-1 block">
                {prevTask.id}
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next Task */}
      {nextTask ? (
        <Link
          href={`/chunes/block/task/${nextTask.id}`}
          className="flex-1 group card-interactive p-4"
        >
          <div className="flex items-start gap-3 sm:flex-row-reverse sm:text-right">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center group-hover:bg-[var(--accent-primary)]/20 transition-colors mt-0.5">
              <ChevronRight className="w-4 h-4 text-[var(--foreground-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs uppercase tracking-wider text-[var(--foreground-tertiary)] block mb-1">
                Next
              </span>
              <span className="text-sm font-medium group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                {nextTask.title}
              </span>
              <span className="text-xs text-[var(--accent-primary)]/70 font-mono mt-1 block">
                {nextTask.id}
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchDocumentById, fetchTaskDetails } from '@/lib/nutrikit/linear-client';
import DescriptionSections from '@/components/nutrikit/sprint/DescriptionSections';

// Revalidate every 2 minutes
export const revalidate = 120;

interface DocPageProps {
  params: Promise<{ id: string; docId: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { id, docId } = await params;
  const doc = await fetchDocumentById(docId);

  return {
    title: doc ? `${doc.title} - ${id} - NutriKit` : `Document - ${id} - NutriKit`,
    description: doc ? `Documentation for task ${id}` : `View documentation for task ${id}`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { id, docId } = await params;

  let doc = null;
  let task = null;
  let error = null;

  try {
    [doc, task] = await Promise.all([
      fetchDocumentById(docId),
      fetchTaskDetails(id),
    ]);

    if (!doc) {
      notFound();
    }
  } catch (e) {
    console.error('Failed to fetch document:', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      {/* Navigation */}
      <header className="glass-subtle header-safe-area">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-accent">
              NutriKit
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/block" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Blocks
              </Link>
            </div>
            <Link
              href="https://apps.apple.com/app/nutrikit"
              className="glass-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-foreground rounded-full"
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
          <ErrorState error={error} taskId={id} docId={docId} />
        ) : doc ? (
          <DocContent doc={doc} task={task} taskId={id} />
        ) : (
          <LoadingState />
        )}
      </main>

      {/* Footer */}
      <footer className="pt-8 safe-area-bottom">
        <p className="text-sm text-muted text-center mb-12">
          &copy; {new Date().getFullYear()} NutriKit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function DocContent({
  doc,
  task,
  taskId
}: {
  doc: NonNullable<Awaited<ReturnType<typeof fetchDocumentById>>>;
  task: Awaited<ReturnType<typeof fetchTaskDetails>>;
  taskId: string;
}) {
  return (
    <div className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/block/task/${taskId}`}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to {taskId}
        </Link>

        {/* Document Header */}
        <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
          {/* Task reference badge */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href={`/block/task/${taskId}`}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {taskId}
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-protein/20 text-protein">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentation
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{doc.title}</h1>

          {/* Task title if available */}
          {task && (
            <p className="text-muted text-sm mb-4">
              For task: <span className="text-foreground/80">{task.title}</span>
            </p>
          )}

          {/* External link */}
          <div className="pt-4 label-separator">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View in Linear
            </a>
          </div>
        </div>

        {/* Document Content Sections */}
        {doc.content ? (
          <DescriptionSections content={doc.content} />
        ) : (
          <div className="glass rounded-2xl p-6 md:p-8 mb-6 text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-muted">
              This document has no content yet, or the content could not be loaded.
            </p>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-accent hover:text-accent-light transition-colors"
            >
              View on Linear
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-center text-xs text-muted-foreground">
          Created {formatDateTime(doc.createdAt)} &middot; Updated {formatDateTime(doc.updatedAt)}
        </div>
      </div>
    </div>
  );
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

function ErrorState({ error, taskId, docId }: { error: string; taskId: string; docId: string }) {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-2xl font-bold mb-4">Couldn&apos;t load document</h2>
          <p className="text-muted mb-2">
            There was an issue fetching the document details.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Document ID: {docId}
          </p>
          <code className="block text-sm text-red-400 bg-white/5 p-4 rounded-xl mb-6 overflow-x-auto">
            {error}
          </code>
          <Link
            href={`/block/task/${taskId}`}
            className="glass-button inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full"
          >
            Back to Task
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <div className="text-6xl mb-6 animate-pulse">📄</div>
          <h2 className="text-2xl font-bold mb-4">Loading document...</h2>
          <p className="text-muted">Please wait while we fetch the document.</p>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  taskIdentifier?: string;
}

// Pattern to match Linear document URLs - ID is the last hex segment after final dash
const linearDocPattern =
  /^https:\/\/linear\.app\/[^\/]+\/document\/.*-([a-f0-9]+)$/;

export default function MarkdownRenderer({
  content,
  taskIdentifier,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headers
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-[var(--border-default)] first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-5 mb-2 text-[var(--foreground-secondary)]">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mt-4 mb-2 text-[var(--foreground-secondary)]">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="leading-relaxed text-[var(--foreground-secondary)]">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => <ul className="ml-1 space-y-1.5">{children}</ul>,
        ol: ({ children }) => (
          <ol className="ml-1 space-y-1.5 list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-[var(--foreground-secondary)]">
            <span className="text-[var(--accent-primary)] mt-1.5 text-xs">
              *
            </span>
            <span className="flex-1">{children}</span>
          </li>
        ),

        // Task list items (checkboxes)
        input: ({ checked }) => (
          <span
            className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded border ${
              checked
                ? "bg-green-500/20 border-green-500/50 text-green-400"
                : "bg-transparent border-[var(--foreground-tertiary)]"
            }`}
          >
            {checked && (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>
        ),

        // Code blocks
        pre: ({ children }) => (
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <pre className="p-3 md:p-4 bg-[var(--background)] rounded-xl border border-[var(--border-default)] text-xs md:text-sm min-w-0">
              {children}
            </pre>
          </div>
        ),
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-[var(--accent-primary)]/10 rounded text-sm font-mono text-[var(--accent-primary)] break-words">
                {children}
              </code>
            );
          }
          return (
            <code className="font-mono text-[var(--foreground-secondary)] leading-relaxed">
              {children}
            </code>
          );
        },

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="pl-4 border-l-4 border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/5 py-2 pr-4 rounded-r-lg italic text-[var(--foreground-secondary)]">
            {children}
          </blockquote>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />
        ),

        // Links
        a: ({ href, children }) => {
          // Check if this is a Linear document link and we have a task identifier
          if (href && taskIdentifier) {
            const match = href.match(linearDocPattern);
            if (match) {
              const docId = match[1];
              return (
                <Link
                  href={`/block/task/${taskIdentifier}/doc/${docId}`}
                  className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] underline decoration-[var(--accent-primary)]/30 hover:decoration-[var(--accent-primary)]/60 transition-colors"
                >
                  {children}
                </Link>
              );
            }
          }

          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] underline decoration-[var(--accent-primary)]/30 hover:decoration-[var(--accent-primary)]/60 transition-colors"
            >
              {children}
            </a>
          );
        },

        // Strong/bold
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),

        // Emphasis/italic
        em: ({ children }) => (
          <em className="italic text-[var(--foreground-secondary)]">
            {children}
          </em>
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="rounded-xl border border-[var(--border-default)] inline-block min-w-full">
              <table className="w-full text-sm">{children}</table>
            </div>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[var(--background-secondary)] border-b border-[var(--border-default)]">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-[var(--border-default)]">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-[var(--background-secondary)]/50 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-semibold text-[var(--foreground-secondary)]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-[var(--foreground-secondary)]">
            {children}
          </td>
        ),

        // Images
        img: ({ src, alt }) => (
          <span className="block">
            <img
              src={src}
              alt={alt || ""}
              className="max-w-full h-auto rounded-xl border border-[var(--border-default)]"
            />
            {alt && (
              <span className="block mt-2 text-sm text-[var(--foreground-tertiary)] text-center italic">
                {alt}
              </span>
            )}
          </span>
        ),

        // Delete/strikethrough
        del: ({ children }) => (
          <del className="text-[var(--foreground-tertiary)] line-through">
            {children}
          </del>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

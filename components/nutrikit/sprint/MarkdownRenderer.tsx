'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  taskIdentifier?: string;
}

// Pattern to match Linear document URLs - ID is the last hex segment after final dash
const linearDocPattern = /^https:\/\/linear\.app\/[^\/]+\/document\/.*-([a-f0-9]+)$/;

export default function MarkdownRenderer({ content, taskIdentifier }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headers
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-foreground/10 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground/90">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mt-4 mb-2 text-foreground/80">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="leading-relaxed text-foreground/85">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="ml-1 space-y-1.5">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="ml-1 space-y-1.5 list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-foreground/85">
            <span className="text-accent mt-1.5 text-xs">●</span>
            <span className="flex-1">{children}</span>
          </li>
        ),

        // Task list items (checkboxes)
        input: ({ checked }) => (
          <span className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded border ${
            checked
              ? 'bg-success/20 border-success/50 text-success'
              : 'bg-transparent border-foreground/30'
          }`}>
            {checked && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        ),

        // Code blocks
        pre: ({ children }) => (
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <pre className="p-3 md:p-4 bg-black/30 rounded-xl border border-foreground/10 text-xs md:text-sm min-w-0">
              {children}
            </pre>
          </div>
        ),
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-white/10 rounded text-sm font-mono text-protein break-words">
                {children}
              </code>
            );
          }
          return (
            <code className="font-mono text-foreground/90 leading-relaxed">
              {children}
            </code>
          );
        },

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="pl-4 border-l-4 border-accent/50 bg-accent/5 py-2 pr-4 rounded-r-lg italic text-foreground/80">
            {children}
          </blockquote>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
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
                  className="text-accent hover:text-accent-light underline decoration-accent/30 hover:decoration-accent/60 transition-colors"
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
              className="text-accent hover:text-accent-light underline decoration-accent/30 hover:decoration-accent/60 transition-colors"
            >
              {children}
            </a>
          );
        },

        // Strong/bold
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">
            {children}
          </strong>
        ),

        // Emphasis/italic
        em: ({ children }) => (
          <em className="italic text-foreground/90">
            {children}
          </em>
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="rounded-xl border border-foreground/10 inline-block min-w-full">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-foreground/5 border-b border-foreground/10">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-foreground/10">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-foreground/5 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-semibold text-foreground/90">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-foreground/80">
            {children}
          </td>
        ),

        // Images
        img: ({ src, alt }) => (
          <span className="block">
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-xl border border-foreground/10"
            />
            {alt && (
              <span className="block mt-2 text-sm text-muted text-center italic">
                {alt}
              </span>
            )}
          </span>
        ),

        // Delete/strikethrough
        del: ({ children }) => (
          <del className="text-muted line-through">
            {children}
          </del>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

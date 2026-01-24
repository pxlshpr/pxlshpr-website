"use client";

import MarkdownRenderer from "./MarkdownRenderer";
import { parseDescription } from "@/lib/chunes/parse-description";

interface DescriptionSectionsProps {
  content: string;
  taskIdentifier?: string;
}

export default function DescriptionSections({
  content,
  taskIdentifier,
}: DescriptionSectionsProps) {
  const { sections } = parseDescription(content);

  return (
    <>
      {sections.map((section, index) => (
        <div key={index} className="card mb-6 overflow-hidden">
          {section.title && (
            <div className="px-6 py-3 bg-[var(--background-secondary)] border-b border-[var(--border-default)]">
              <span className="text-sm font-semibold text-[var(--accent-primary)]">
                {section.title}
              </span>
            </div>
          )}
          <div className="p-6 md:p-8 max-w-none space-y-3">
            <MarkdownRenderer
              content={section.content}
              taskIdentifier={taskIdentifier}
            />
          </div>
        </div>
      ))}
    </>
  );
}

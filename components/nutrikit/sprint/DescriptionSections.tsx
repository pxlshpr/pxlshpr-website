'use client';

import MarkdownRenderer from './MarkdownRenderer';
import { parseDescription } from '@/lib/nutrikit/parse-description';

interface DescriptionSectionsProps {
  content: string;
  taskIdentifier?: string;
}

export default function DescriptionSections({ content, taskIdentifier }: DescriptionSectionsProps) {
  const { sections } = parseDescription(content);

  return (
    <>
      {sections.map((section, index) => (
        <div key={index} className="terminal-window mb-6 overflow-hidden">
          {section.title && (
            <div className="terminal-title-bar">
              <div className="terminal-dots">
                <div className="terminal-dot-magenta" />
                <div className="terminal-dot-cyan" />
                <div className="terminal-dot-orange" />
              </div>
              <span className="text-xs font-mono uppercase text-secondary/70">
                {section.title}
              </span>
            </div>
          )}
          <div className="p-6 md:p-8 max-w-none space-y-3">
            <MarkdownRenderer content={section.content} taskIdentifier={taskIdentifier} />
          </div>
        </div>
      ))}
    </>
  );
}

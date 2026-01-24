'use client';

import Link from 'next/link';
import TerminalViewer from '@/components/nutrikit/terminal/TerminalViewer';

export default function LiveTerminalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50">
        <Link
          href="/"
          className="font-heading text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          NUTRIKIT
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/block"
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            View Tasks
          </Link>
        </div>
      </header>

      {/* Full-screen terminal viewer */}
      <main className="flex-1 flex flex-col">
        <TerminalViewer
          className="flex-1"
          autoConnect={true}
          showHeader={true}
        />
      </main>

      {/* Minimal footer */}
      <footer className="px-4 py-2 border-t border-white/10 bg-black/50 text-center">
        <p className="text-xs font-mono text-zinc-500">
          Live terminal session from NutriKit development
        </p>
      </footer>
    </div>
  );
}

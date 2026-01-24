import Link from 'next/link';
import { fetchSprintData } from '@/lib/nutrikit/sprint-parser';
import SprintHero from '@/components/nutrikit/sprint/SprintHero';
import TaskBoard from '@/components/nutrikit/sprint/TaskBoard';
import SprintTimeline from '@/components/nutrikit/sprint/SprintTimeline';
import DailyLog from '@/components/nutrikit/sprint/DailyLog';
import VaporwaveBackground from '@/components/nutrikit/backgrounds/VaporwaveBackground';
import { Button } from '@/components/nutrikit/ui';

// Revalidate every 30 seconds for near real-time Linear status updates
export const revalidate = 30;

export const metadata = {
  title: 'Development Tracker - NutriKit',
  description: 'Track the current NutriKit development block progress',
};

export default async function SprintPage() {
  let sprintData;
  let error = null;

  try {
    sprintData = await fetchSprintData();
  } catch (e) {
    console.error('Failed to fetch sprint data:', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Vaporwave Background */}
      <VaporwaveBackground />

      {/* Navigation - Terminal Window Style */}
      <header className="glass border-b-2 border-secondary/30 header-safe-area z-20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/nutrikit" className="font-heading text-2xl font-bold gradient-text">
              NUTRIKIT
            </Link>
            <Link href="https://apps.apple.com/app/nutrikit">
              <Button variant="ghost" size="sm">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" style={{ height: `calc(5rem + env(safe-area-inset-top, 0px))` }} />

      <main className="flex-1">
        {error ? (
          <ErrorState error={error} />
        ) : sprintData ? (
          <>
            <SprintHero sprint={sprintData.current} />
            <TaskBoard tasks={sprintData.current.tasks} />
            <SprintTimeline
              currentSprint={sprintData.current.info}
              config={sprintData.config}
              currentTasks={sprintData.current.tasks}
              plannedSprints={sprintData.plannedSprints}
              completedSprints={sprintData.completedSprints}
            />
            <DailyLog entries={sprintData.current.dailyLog} />

            {/* Blockers section if any */}
            {sprintData.current.blockers && !sprintData.current.blockers.includes('Track any blockers') && (
              <section className="section-padding">
                <div className="container-vaporwave">
                  <h2 className="font-heading text-3xl font-bold mb-8 text-glow-cyan">
                    &gt; Challenges & Learnings
                  </h2>
                  <div className="card">
                    <p className="font-mono text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {sprintData.current.blockers}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Last updated - Terminal style */}
            <div className="py-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
                <p className="text-xs font-mono uppercase tracking-widest text-secondary/70">
                  Live Sync Active
                </p>
              </div>
              <p className="text-xs font-mono text-foreground/50">
                Task statuses update from Linear every 30 seconds
              </p>
            </div>
          </>
        ) : (
          <LoadingState />
        )}
      </main>

      {/* Footer - Terminal style */}
      <footer className="pt-8 pb-12 safe-area-bottom relative z-10">
        <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 text-center">
          <span className="text-primary">[</span> &copy; {new Date().getFullYear()} NutriKit <span className="text-primary">]</span> <span className="text-secondary mx-2">|</span> All rights reserved
        </p>
      </footer>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <section className="section-padding">
      <div className="container-vaporwave text-center">
        <div className="terminal-window max-w-2xl mx-auto">
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
            <h2 className="font-heading text-3xl font-bold mb-4 text-glow-magenta">
              System Error
            </h2>
            <p className="font-mono text-foreground/70 mb-6">
              &gt; Failed to load block data from Linear
            </p>
            <code className="block text-sm text-primary font-mono bg-black/50 border border-primary/30 p-4 rounded-none mb-8 overflow-x-auto text-left">
              {error}
            </code>
            <Link href="/nutrikit">
              <Button variant="primary">
                Return Home
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
    <section className="section-padding">
      <div className="container-vaporwave text-center">
        <div className="glass-strong border-2 border-secondary/30 rounded-none max-w-2xl mx-auto p-12">
          <div className="text-6xl mb-6 animate-pulse">⏳</div>
          <h2 className="font-heading text-3xl font-bold mb-4 text-glow-cyan">
            Loading Data
          </h2>
          <p className="font-mono text-foreground/70 mb-4">
            &gt; Fetching latest block information from Linear...
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <span className="text-xs font-mono uppercase tracking-widest text-secondary/70">
              Please Wait
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

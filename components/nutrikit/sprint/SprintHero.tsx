'use client';

import { useState, useEffect } from 'react';
import { SprintData, getSprintName, calculateProgress } from '@/lib/nutrikit/sprint-parser';

interface SprintHeroProps {
  sprint: SprintData;
}

// Block number offset (adjusts display number from file number)
const BLOCK_OFFSET = 0;

// Get current time in Maldives (UTC+5)
function getMaldivesNow(): Date {
  const now = new Date();
  // Create a date object representing Maldives time
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + 5 * 60 * 60 * 1000); // UTC+5
}

// Calculate time remaining until midnight Maldives time on end date
function getTimeRemaining(endDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  totalMs: number;
} {
  const maldivesNow = getMaldivesNow();

  // End of sprint day (midnight = end of the day)
  const endMidnight = new Date(endDate);
  endMidnight.setHours(23, 59, 59, 999);

  const diffMs = endMidnight.getTime() - maldivesNow.getTime();
  const isOverdue = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOverdue, totalMs: diffMs };
}

// Format date range nicely (e.g., "Jan 3-5, 2026" or "Dec 30 - Jan 1, 2026")
function formatDateRange(start: Date, end: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[start.getMonth()];
  const endMonth = months[end.getMonth()];
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    // Same month: "Jan 3-5, 2026"
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    // Different months, same year: "Dec 30 - Jan 1, 2026"
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } else {
    // Different years: "Dec 30, 2025 - Jan 1, 2026"
    return `${startMonth} ${startDay}, ${start.getFullYear()} - ${endMonth} ${endDay}, ${year}`;
  }
}

export default function SprintHero({ sprint }: SprintHeroProps) {
  const { info, tasks } = sprint;
  const progress = calculateProgress(tasks);
  const displayBlockNumber = info.number + BLOCK_OFFSET;
  const blockName = getSprintName(displayBlockNumber);
  const completedTasks = tasks.filter(t => t.status === 'Done' || t.status === 'Testing').length;

  // Use dates from the markdown file instead of calculating dynamically
  const sprintStart = new Date(info.startDate);
  const sprintEnd = new Date(info.endDate);

  // State for countdown that updates every second
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(sprintEnd));

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(sprintEnd));
    }, 1000);

    return () => clearInterval(interval);
  }, [sprintEnd]);

  const { days, hours, minutes, seconds, isOverdue, totalMs } = timeRemaining;

  // SVG circle calculations
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  // Determine urgency level
  const isUrgent = !isOverdue && totalMs < 24 * 60 * 60 * 1000; // Less than 24 hours
  const isWarning = !isOverdue && !isUrgent && totalMs < 48 * 60 * 60 * 1000; // Less than 48 hours

  return (
    <section className="relative section-padding">
      <div className="container-vaporwave">
        <div className="glass border-2 border-primary/30 border-t-2 border-t-secondary rounded-none p-8 md:p-12 relative overflow-hidden transition-all duration-200 hover:border-secondary/50 hover:shadow-glow-cyan">
          {/* Neon background glow effect */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left side: Sprint info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Status badge - Terminal style */}
              <div className="inline-flex items-center gap-3 glass-subtle px-5 py-2.5 rounded-none text-sm font-mono uppercase tracking-wider text-secondary mb-6 border-2 border-secondary/60 shadow-glow-cyan transform -skew-x-6">
                <div className="relative flex items-center justify-center w-5 h-5 skew-x-6">
                  {/* Pulsing ring */}
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--tertiary)' }}></span>
                  {/* Solid center dot */}
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--tertiary)' }}></span>
                </div>
                <span className="skew-x-6">
                  {info.status === 'ACTIVE' ? 'Active Now' : info.status}
                </span>
              </div>

              {/* Block number - Cyan terminal text */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <span className="font-mono text-lg font-medium text-secondary/70 uppercase tracking-widest">
                  &gt; BLOCK {displayBlockNumber}
                </span>
              </div>

              {/* Block name - Gradient with glow */}
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tight gradient-text heading-glow mb-4">
                {blockName}
              </h1>

              {/* Block theme - Monospace */}
              <p className="font-mono text-foreground/70 text-lg mb-6">{info.theme}</p>

              {/* Countdown Banner - Terminal display */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-none bg-black/50 border-2 border-primary/30">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs font-mono uppercase tracking-widest text-primary">
                    {isOverdue ? 'Overdue' : 'Time Remaining'}
                  </div>
                  <div className="text-xl font-bold font-mono gradient-text" suppressHydrationWarning>
                    {isOverdue ? (
                      <span suppressHydrationWarning>
                        +{days}d {hours}h {minutes}m {seconds}s
                      </span>
                    ) : (
                      <span suppressHydrationWarning>
                        {days}d {hours}h {minutes}m {seconds}s
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date range - Terminal style */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-foreground/50 mt-6 text-sm font-mono">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDateRange(sprintStart, sprintEnd)}</span>
              </div>
            </div>

            {/* Right side: Progress ring - Vaporwave gradient */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]" viewBox="0 0 192 192">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="rgba(45,27,78,0.5)"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle with sunset gradient */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="url(#vaporwaveGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="vaporwaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--tertiary)" />
                      <stop offset="50%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center content - Terminal style */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-heading text-4xl md:text-5xl font-black gradient-text">{progress}%</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-secondary/70 mt-2">Complete</div>
                  <div className="text-sm font-mono text-foreground/60 mt-2">
                    {completedTasks} / {tasks.length} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block goal - Terminal section */}
          {sprint.goal && (
            <div className="relative z-10 mt-8 pt-8 border-t-2 border-secondary/20">
              <h3 className="text-sm font-mono uppercase tracking-widest text-secondary/70 mb-3">
                &gt; Current Focus
              </h3>
              <p className="font-mono text-lg text-foreground/90 leading-relaxed">{sprint.goal}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

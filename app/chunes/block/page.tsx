import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, RefreshCw, ExternalLink, CheckCircle2, Circle, Clock } from "lucide-react";

export const revalidate = 30;

type TaskStatus = "Ready" | "In Progress" | "Done" | "Planned";
type TaskPriority = "Urgent" | "High" | "Medium" | "Low";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

interface DailyLog {
  day: number;
  date: string;
  morningStandup: string;
  eodSummary: string;
  buildSubmitted?: string;
}

interface SprintData {
  status: string;
  blockNumber: number;
  blockLabel: string;
  theme: string;
  startDate: string;
  endDate: string;
  goal: string;
  tasks: Task[];
  dailyLog: DailyLog[];
  blockers: string;
  outcome: {
    tasksPlanned: number;
    tasksCompleted: number;
    buildVersion: string;
    submitted: string;
  };
}

interface PlannedBlock {
  number: number;
  name: string;
  dates: string;
  focus: string;
  tasks: Task[];
}

// Fallback data
const fallbackSprintData: SprintData = {
  status: "NOT STARTED",
  blockNumber: 1,
  blockLabel: "b1-bach",
  theme: "Foundation & Core Playback",
  startDate: "Sat, Jan 11, 2026",
  endDate: "Mon, Jan 13, 2026",
  goal: "Establish the core foundation for Chunes MVP. Focus on Apple Music integration, basic playback, and essential app stability.",
  tasks: [
    { id: "PXL-868", title: "Remove Spotify Integration Code", status: "Ready", priority: "Urgent" },
    { id: "PXL-871", title: "Complete Apple Music Metadata Fetching", status: "Ready", priority: "Urgent" },
    { id: "PXL-873", title: "Reliable Music Playback Foundation", status: "Ready", priority: "High" },
    { id: "PXL-874", title: "Fix App Startup and Basic Navigation", status: "Ready", priority: "High" },
  ],
  dailyLog: [
    { day: 1, date: "Sat, Jan 11", morningStandup: "-", eodSummary: "-" },
    { day: 2, date: "Sun, Jan 12", morningStandup: "-", eodSummary: "-" },
    { day: 3, date: "Mon, Jan 13", morningStandup: "-", eodSummary: "-", buildSubmitted: "-" },
  ],
  blockers: "_Track any blockers or important discoveries during the block_",
  outcome: {
    tasksPlanned: 4,
    tasksCompleted: 0,
    buildVersion: "-",
    submitted: "-",
  },
};

const fallbackPlannedBlocks: PlannedBlock[] = [
  {
    number: 1,
    name: "bach",
    dates: "Sat Jan 11 - Mon Jan 13, 2026",
    focus: "Foundation & Core Playback",
    tasks: [
      { id: "PXL-868", title: "Remove Spotify Integration Code", status: "Planned", priority: "Urgent" },
      { id: "PXL-871", title: "Complete Apple Music Metadata Fetching", status: "Planned", priority: "Urgent" },
      { id: "PXL-873", title: "Reliable Music Playback Foundation", status: "Planned", priority: "High" },
      { id: "PXL-874", title: "Fix App Startup and Basic Navigation", status: "Planned", priority: "High" },
    ],
  },
  {
    number: 2,
    name: "miles",
    dates: "Tue Jan 14 - Thu Jan 16, 2026",
    focus: "Tagging System Core",
    tasks: [
      { id: "PXL-878", title: "Tag Management System", status: "Planned", priority: "High" },
      { id: "PXL-881", title: "Add Tags to Songs", status: "Planned", priority: "High" },
      { id: "PXL-885", title: "View Songs by Tag", status: "Planned", priority: "Medium" },
      { id: "PXL-887", title: "Tag Categories and Organization", status: "Planned", priority: "Medium" },
    ],
  },
  {
    number: 3,
    name: "jimi",
    dates: "Fri Jan 17 - Sun Jan 19, 2026",
    focus: "Markers & Moments",
    tasks: [
      { id: "PXL-876", title: "Create and Save Song Markers", status: "Planned", priority: "High" },
      { id: "PXL-879", title: "Jump to Markers During Playback", status: "Planned", priority: "High" },
      { id: "PXL-882", title: "Edit and Manage Markers", status: "Planned", priority: "Medium" },
      { id: "PXL-886", title: "Filter Songs by Marker Names", status: "Planned", priority: "Medium" },
    ],
  },
  {
    number: 4,
    name: "ella",
    dates: "Mon Jan 20 - Wed Jan 22, 2026",
    focus: "Filtering & Discovery",
    tasks: [
      { id: "PXL-867", title: "Vocal Level Filtering", status: "Planned", priority: "High" },
      { id: "PXL-869", title: "Sort Your Music Your Way", status: "Planned", priority: "High" },
      { id: "PXL-870", title: "Filter by Release Date and Duration", status: "Planned", priority: "Medium" },
      { id: "PXL-872", title: "Save Favorite Filter Combinations", status: "Planned", priority: "Medium" },
    ],
  },
  {
    number: 5,
    name: "duke",
    dates: "Thu Jan 23 - Sat Jan 25, 2026",
    focus: "Import & Export",
    tasks: [
      { id: "PXL-875", title: "Export Your Chunes Data", status: "Planned", priority: "High" },
      { id: "PXL-877", title: "Import Chunes Data", status: "Planned", priority: "High" },
      { id: "PXL-880", title: "Selective Export by Filter", status: "Planned", priority: "Medium" },
      { id: "PXL-883", title: "Data Integrity and Validation", status: "Planned", priority: "Medium" },
    ],
  },
  {
    number: 6,
    name: "nina",
    dates: "Sun Jan 26 - Tue Jan 28, 2026",
    focus: "Polish & Launch Prep",
    tasks: [
      { id: "PXL-884", title: "Search Your Library", status: "Planned", priority: "High" },
      { id: "PXL-888", title: "Visualizer and Now Playing Polish", status: "Planned", priority: "Medium" },
      { id: "PXL-889", title: "Performance Optimization", status: "Planned", priority: "High" },
      { id: "PXL-890", title: "TestFlight Preparation and Bug Fixes", status: "Planned", priority: "Urgent" },
    ],
  },
];

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "Done":
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "In Progress":
      return <Clock className="w-4 h-4 text-[var(--accent-secondary)]" />;
    default:
      return <Circle className="w-4 h-4 text-[var(--foreground-tertiary)]" />;
  }
}

function getPriorityColor(priority: TaskPriority) {
  switch (priority) {
    case "Urgent":
      return "tag-mood";
    case "High":
      return "tag-activity";
    case "Medium":
      return "tag-genre";
    default:
      return "tag-teal";
  }
}

function calculateProgress(tasks: Task[]) {
  const done = tasks.filter((t) => t.status === "Done").length;
  return {
    completed: done,
    total: tasks.length,
    percentage: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
  };
}

export default function BlockPage() {
  const sprint = fallbackSprintData;
  const blocks = fallbackPlannedBlocks;
  const isLive = false;
  const progress = calculateProgress(sprint.tasks);

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

            {/* Status Badge */}
            <div className="hidden md:flex items-center gap-3">
              <span className="pill pill-primary text-sm">Development Tracker</span>
              {isLive ? (
                <span className="pill pill-pink text-sm">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Live
                </span>
              ) : (
                <span className="text-xs text-[var(--foreground-tertiary)]">Static Data</span>
              )}
            </div>

            {/* Back Button */}
            <Link href="/chunes" className="btn btn-outline btn-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-app py-12 md:py-16 relative z-10">
        {/* Sprint Hero */}
        <section className="mb-16">
          <div className="card p-8 md:p-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag-pill tag-genre">Block {sprint.blockNumber}</span>
                  <span className="text-sm text-[var(--foreground-tertiary)]">{sprint.blockLabel}</span>
                </div>
                <h1 className="mb-4">
                  <span className="gradient-text">{sprint.theme}</span>
                </h1>
                <p className="text-lg text-[var(--foreground-secondary)] mb-6 leading-relaxed">
                  {sprint.goal}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-secondary)]">
                  <span>{sprint.startDate} - {sprint.endDate}</span>
                  <span className="text-[var(--accent-primary)]">{sprint.status}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="lg:w-64">
                <div className="card p-6 bg-[var(--background-secondary)]">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold gradient-text">{progress.percentage}%</div>
                    <div className="text-sm text-[var(--foreground-secondary)]">Complete</div>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-center mt-2 text-sm text-[var(--foreground-tertiary)]">
                    {progress.completed} / {progress.total} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2>
              Sprint <span className="gradient-text">Tasks</span>
            </h2>
            <span className="tag-pill tag-genre">Block {sprint.blockNumber}</span>
          </div>

          <div className="grid gap-4">
            {sprint.tasks.map((task) => (
              <Link
                key={task.id}
                href={`/chunes/block/task/${task.id}`}
                className="card-interactive p-4 md:p-6 flex items-center gap-4 group"
              >
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[var(--foreground-tertiary)] font-mono group-hover:text-[var(--accent-primary)] transition-colors">
                      {task.id}
                    </span>
                  </div>
                  <h3 className="font-semibold truncate">{task.title}</h3>
                </div>
                <span className={`tag-pill ${getPriorityColor(task.priority)} text-xs`}>
                  {task.priority}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Daily Log */}
        {sprint.dailyLog.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8">
              Daily <span className="gradient-text">Log</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {sprint.dailyLog.map((day) => (
                <div key={day.day} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">Day {day.day}</span>
                    <span className="text-xs text-[var(--foreground-tertiary)]">{day.date}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-[var(--foreground-tertiary)] uppercase tracking-wider block mb-1">Standup</span>
                      <p className="text-[var(--foreground-secondary)]">
                        {day.morningStandup === "-" ? "—" : day.morningStandup}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--foreground-tertiary)] uppercase tracking-wider block mb-1">EOD Summary</span>
                      <p className="text-[var(--foreground-secondary)]">
                        {day.eodSummary === "-" ? "—" : day.eodSummary}
                      </p>
                    </div>
                    {day.buildSubmitted && (
                      <div>
                        <span className="text-xs text-[var(--foreground-tertiary)] uppercase tracking-wider block mb-1">Build</span>
                        <p className="text-[var(--foreground-secondary)]">
                          {day.buildSubmitted === "-" ? "—" : day.buildSubmitted}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sprint Timeline */}
        <section className="mb-16">
          <h2 className="mb-8">
            Sprint <span className="gradient-text">Timeline</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block) => {
              const isCurrent = block.number === sprint.blockNumber;
              const blockProgress = calculateProgress(block.tasks);
              return (
                <div
                  key={block.number}
                  className={`card p-6 ${isCurrent ? "ring-2 ring-[var(--accent-primary)]" : ""}`}
                >
                  {isCurrent && (
                    <span className="tag-pill tag-mood text-xs mb-4 inline-block">Current</span>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold">{String(block.number).padStart(2, "0")}</span>
                    <span className="text-sm italic text-[var(--foreground-tertiary)]">{block.name}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{block.focus}</h3>
                  <p className="text-xs text-[var(--foreground-tertiary)] mb-3">{block.dates}</p>
                  <div className="h-1.5 bg-[var(--background)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"
                      style={{ width: `${blockProgress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-[var(--foreground-tertiary)] mt-1">
                    {blockProgress.completed}/{blockProgress.total} tasks
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Linear Link */}
        <section className="text-center">
          <div className="card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />
            <div className="relative z-10">
              <p className="text-lg text-[var(--foreground-secondary)] mb-6">
                Want to see more details?
              </p>
              <a
                href="https://linear.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg inline-flex items-center"
              >
                <span>View in Linear</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8 relative z-10">
        <div className="container-app text-center">
          <p className="text-sm text-[var(--foreground-tertiary)]">
            Building Chunes in public • 6 Blocks • 18 Days
          </p>
        </div>
      </footer>
    </div>
  );
}

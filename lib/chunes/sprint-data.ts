// Sprint data types
export type TaskStatus = "Ready" | "In Progress" | "Done" | "Planned";
export type TaskPriority = "Urgent" | "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
}

export interface DailyLog {
  day: number;
  date: string;
  morningStandup: string;
  eodSummary: string;
  buildSubmitted?: string;
}

export interface SprintData {
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

export interface PlannedBlock {
  number: number;
  name: string;
  dates: string;
  focus: string;
  tasks: Task[];
}

// Current sprint data
export const currentSprintData: SprintData = {
  status: "NOT STARTED",
  blockNumber: 1,
  blockLabel: "b1-bach",
  theme: "Foundation & Core Playback",
  startDate: "Sat, Jan 11, 2026",
  endDate: "Mon, Jan 13, 2026",
  goal: "Establish the core foundation for Chunes MVP. Focus on Apple Music integration, basic playback, and essential app stability.",
  tasks: [
    {
      id: "PXL-868",
      title: "Remove Spotify Integration Code",
      status: "Ready",
      priority: "Urgent",
      description: `Remove all Spotify-related code from the codebase since we're focusing exclusively on Apple Music.

## Background

Due to Spotify's recent API policy changes requiring 250,000 MAU for extended access, we're pivoting to Apple Music only. This task involves removing all Spotify integration code to clean up the codebase.

## Tasks

- Remove SpotifyService and related files
- Remove Spotify authentication flow
- Remove Spotify-specific UI components
- Update any shared code that referenced Spotify
- Clean up unused dependencies`,
    },
    {
      id: "PXL-871",
      title: "Complete Apple Music Metadata Fetching",
      status: "Ready",
      priority: "Urgent",
      description: `Ensure we can reliably fetch all necessary metadata from Apple Music for songs in the user's library.

## Requirements

- Fetch song title, artist, album
- Fetch album artwork in multiple resolutions
- Fetch duration, release date
- Handle tracks without complete metadata gracefully

## Technical Notes

Use MusicKit's library access APIs to enumerate and fetch metadata for all songs.`,
    },
    {
      id: "PXL-873",
      title: "Reliable Music Playback Foundation",
      status: "Ready",
      priority: "High",
      description: `Build a solid foundation for music playback that handles all edge cases.

## Features

- Play/pause/skip controls
- Seek to position
- Handle interruptions (calls, other apps)
- Background audio support
- Now Playing info on lock screen

## Technical Considerations

Use AVAudioSession correctly for background playback. Implement proper handling of audio route changes.`,
    },
    {
      id: "PXL-874",
      title: "Fix App Startup and Basic Navigation",
      status: "Ready",
      priority: "High",
      description: `Ensure the app starts reliably and basic navigation works smoothly.

## Issues to Address

- App sometimes hangs on startup
- Tab bar navigation inconsistent
- Memory warnings on older devices

## Success Criteria

- App launches in under 2 seconds
- All navigation flows work correctly
- No crashes on supported devices`,
    },
  ],
  dailyLog: [
    { day: 1, date: "Sat, Jan 11", morningStandup: "-", eodSummary: "-" },
    { day: 2, date: "Sun, Jan 12", morningStandup: "-", eodSummary: "-" },
    {
      day: 3,
      date: "Mon, Jan 13",
      morningStandup: "-",
      eodSummary: "-",
      buildSubmitted: "-",
    },
  ],
  blockers: "_Track any blockers or important discoveries during the block_",
  outcome: {
    tasksPlanned: 4,
    tasksCompleted: 0,
    buildVersion: "-",
    submitted: "-",
  },
};

// Planned blocks data
export const plannedBlocks: PlannedBlock[] = [
  {
    number: 1,
    name: "bach",
    dates: "Sat Jan 11 - Mon Jan 13, 2026",
    focus: "Foundation & Core Playback",
    tasks: [
      {
        id: "PXL-868",
        title: "Remove Spotify Integration Code",
        status: "Planned",
        priority: "Urgent",
      },
      {
        id: "PXL-871",
        title: "Complete Apple Music Metadata Fetching",
        status: "Planned",
        priority: "Urgent",
      },
      {
        id: "PXL-873",
        title: "Reliable Music Playback Foundation",
        status: "Planned",
        priority: "High",
      },
      {
        id: "PXL-874",
        title: "Fix App Startup and Basic Navigation",
        status: "Planned",
        priority: "High",
      },
    ],
  },
  {
    number: 2,
    name: "miles",
    dates: "Tue Jan 14 - Thu Jan 16, 2026",
    focus: "Tagging System Core",
    tasks: [
      {
        id: "PXL-878",
        title: "Tag Management System",
        status: "Planned",
        priority: "High",
        description: `Build the core tag management system for organizing music.

## Features

- Create, edit, delete tags
- Tag categories: Moods, Activities, Genres, Instruments
- Color coding for tag types
- Tag suggestions based on song metadata`,
      },
      {
        id: "PXL-881",
        title: "Add Tags to Songs",
        status: "Planned",
        priority: "High",
        description: `Allow users to add tags to their songs.

## Features

- Quick tag picker UI
- Multiple tags per song
- Tag autocomplete
- Recently used tags`,
      },
      {
        id: "PXL-885",
        title: "View Songs by Tag",
        status: "Planned",
        priority: "Medium",
        description: `Browse and filter songs by their tags.

## Features

- Tag cloud view
- Filter by single or multiple tags
- AND/OR filter logic
- Save filter combinations`,
      },
      {
        id: "PXL-887",
        title: "Tag Categories and Organization",
        status: "Planned",
        priority: "Medium",
        description: `Organize tags into meaningful categories.

## Categories

- Moods (Energetic, Chill, Melancholic, etc.)
- Activities (Workout, Study, Road Trip, etc.)
- Genres (Rock, Electronic, Jazz, etc.)
- Instruments (Guitar, Piano, Drums, etc.)`,
      },
    ],
  },
  {
    number: 3,
    name: "jimi",
    dates: "Fri Jan 17 - Sun Jan 19, 2026",
    focus: "Markers & Moments",
    tasks: [
      {
        id: "PXL-876",
        title: "Create and Save Song Markers",
        status: "Planned",
        priority: "High",
        description: `Allow users to mark specific moments in songs.

## Features

- Tap to create marker at current position
- Name markers with text or emoji
- Store markers with timestamps
- Sync markers across devices`,
      },
      {
        id: "PXL-879",
        title: "Jump to Markers During Playback",
        status: "Planned",
        priority: "High",
        description: `Enable quick navigation to marked moments.

## Features

- Marker list overlay during playback
- Tap marker to jump to position
- Visual marker indicators on progress bar
- Swipe gestures to navigate markers`,
      },
      {
        id: "PXL-882",
        title: "Edit and Manage Markers",
        status: "Planned",
        priority: "Medium",
        description: `Full marker management capabilities.

## Features

- Edit marker name and position
- Delete markers
- Reorder markers
- Bulk marker operations`,
      },
      {
        id: "PXL-886",
        title: "Filter Songs by Marker Names",
        status: "Planned",
        priority: "Medium",
        description: `Find songs based on their markers.

## Features

- Search by marker name
- Filter songs with specific marker types
- "Songs with drops" filter
- "Songs with solos" filter`,
      },
    ],
  },
  {
    number: 4,
    name: "ella",
    dates: "Mon Jan 20 - Wed Jan 22, 2026",
    focus: "Filtering & Discovery",
    tasks: [
      {
        id: "PXL-867",
        title: "Vocal Level Filtering",
        status: "Planned",
        priority: "High",
        description: `Filter songs by vocal presence.

## Levels

- Instrumental only
- Minimal vocals
- Normal vocals
- Vocal-heavy

## Implementation

Allow manual tagging with optional AI assistance.`,
      },
      {
        id: "PXL-869",
        title: "Sort Your Music Your Way",
        status: "Planned",
        priority: "High",
        description: `Comprehensive sorting options.

## Sort Options

- Date Added (latest/oldest)
- Release Date (newest/oldest)
- Play Count (most/least)
- Skip Count (most/least)
- Duration (longest/shortest)
- Last Played (latest/oldest)`,
      },
      {
        id: "PXL-870",
        title: "Filter by Release Date and Duration",
        status: "Planned",
        priority: "Medium",
        description: `Time-based filtering options.

## Features

- Filter by decade/year range
- Filter by duration range
- "Long songs only" preset
- "Recent releases" preset`,
      },
      {
        id: "PXL-872",
        title: "Save Favorite Filter Combinations",
        status: "Planned",
        priority: "Medium",
        description: `Save and reuse filter combinations as "Mixes".

## Features

- Name and save current filters
- Custom icons for saved mixes
- Quick access to favorite mixes
- Share mix configurations`,
      },
    ],
  },
  {
    number: 5,
    name: "duke",
    dates: "Thu Jan 23 - Sat Jan 25, 2026",
    focus: "Import & Export",
    tasks: [
      {
        id: "PXL-875",
        title: "Export Your Chunes Data",
        status: "Planned",
        priority: "High",
        description: `Export all user data for backup.

## Export Includes

- All tags and tag assignments
- All markers
- Saved mixes/filters
- User preferences

## Format

JSON export with clear schema documentation.`,
      },
      {
        id: "PXL-877",
        title: "Import Chunes Data",
        status: "Planned",
        priority: "High",
        description: `Import previously exported data.

## Features

- Validate import file
- Preview changes before applying
- Merge or replace options
- Handle missing songs gracefully`,
      },
      {
        id: "PXL-880",
        title: "Selective Export by Filter",
        status: "Planned",
        priority: "Medium",
        description: `Export data for specific songs only.

## Features

- Export tags for filtered songs
- Export markers for specific songs
- Partial backup support`,
      },
      {
        id: "PXL-883",
        title: "Data Integrity and Validation",
        status: "Planned",
        priority: "Medium",
        description: `Ensure data consistency and reliability.

## Features

- Validate data on import
- Check for orphaned tags/markers
- Repair corrupted data
- Data migration support`,
      },
    ],
  },
  {
    number: 6,
    name: "nina",
    dates: "Sun Jan 26 - Tue Jan 28, 2026",
    focus: "Polish & Launch Prep",
    tasks: [
      {
        id: "PXL-884",
        title: "Search Your Library",
        status: "Planned",
        priority: "High",
        description: `Full-text search across library.

## Search Scope

- Song titles
- Artist names
- Album names
- Tag names
- Marker names`,
      },
      {
        id: "PXL-888",
        title: "Visualizer and Now Playing Polish",
        status: "Planned",
        priority: "Medium",
        description: `Polish the now playing experience.

## Features

- Smooth vinyl animation
- Album art transitions
- Visualizer effects
- Gesture controls`,
      },
      {
        id: "PXL-889",
        title: "Performance Optimization",
        status: "Planned",
        priority: "High",
        description: `Optimize for large libraries.

## Focus Areas

- Library loading speed
- Scroll performance
- Memory usage
- Battery efficiency`,
      },
      {
        id: "PXL-890",
        title: "TestFlight Preparation and Bug Fixes",
        status: "Planned",
        priority: "Urgent",
        description: `Final preparations for TestFlight release.

## Tasks

- Fix all critical bugs
- Complete App Store metadata
- Prepare TestFlight notes
- Set up crash reporting`,
      },
    ],
  },
];

// Helper function to get all tasks from all blocks
export function getAllTasks(): Task[] {
  const allTasks: Task[] = [...currentSprintData.tasks];

  for (const block of plannedBlocks) {
    for (const task of block.tasks) {
      // Only add if not already in the list (avoid duplicates from current sprint)
      if (!allTasks.find((t) => t.id === task.id)) {
        allTasks.push(task);
      }
    }
  }

  return allTasks;
}

// Helper function to find a task by ID
export function findTaskById(taskId: string): Task | null {
  const allTasks = getAllTasks();
  return allTasks.find((t) => t.id === taskId) || null;
}

// Helper function to find the block containing a task
export function findBlockForTask(
  taskId: string
): { block: PlannedBlock; isCurrent: boolean } | null {
  // Check current sprint first
  if (currentSprintData.tasks.find((t) => t.id === taskId)) {
    return {
      block: {
        number: currentSprintData.blockNumber,
        name: currentSprintData.blockLabel.split("-")[1] || "",
        dates: `${currentSprintData.startDate} - ${currentSprintData.endDate}`,
        focus: currentSprintData.theme,
        tasks: currentSprintData.tasks,
      },
      isCurrent: true,
    };
  }

  // Check planned blocks
  for (const block of plannedBlocks) {
    if (block.tasks.find((t) => t.id === taskId)) {
      return { block, isCurrent: false };
    }
  }

  return null;
}

// Get priority number from label
export function getPriorityNumber(priority: TaskPriority): number {
  switch (priority) {
    case "Urgent":
      return 1;
    case "High":
      return 2;
    case "Medium":
      return 3;
    case "Low":
      return 4;
    default:
      return 3;
  }
}

// Get status color class
export function getStatusColorClass(status: TaskStatus): string {
  switch (status) {
    case "Done":
      return "tag-pill tag-teal";
    case "In Progress":
      return "tag-pill tag-mood";
    case "Ready":
      return "tag-pill tag-genre";
    case "Planned":
      return "bg-[var(--foreground-tertiary)]/20 text-[var(--foreground-tertiary)]";
    default:
      return "bg-[var(--foreground-tertiary)]/20 text-[var(--foreground-tertiary)]";
  }
}

// Get priority color class
export function getPriorityColorClass(priority: TaskPriority): string {
  switch (priority) {
    case "Urgent":
      return "text-red-400";
    case "High":
      return "text-orange-400";
    case "Medium":
      return "text-[var(--accent-tertiary)]";
    case "Low":
      return "text-[var(--foreground-tertiary)]";
    default:
      return "text-[var(--foreground-tertiary)]";
  }
}

// Get adjacent tasks for navigation
export function getAdjacentTasks(
  taskId: string
): { prevTask: Task | null; nextTask: Task | null } {
  const allTasks = getAllTasks();
  const currentIndex = allTasks.findIndex((t) => t.id === taskId);

  if (currentIndex === -1) {
    return { prevTask: null, nextTask: null };
  }

  return {
    prevTask: currentIndex > 0 ? allTasks[currentIndex - 1] : null,
    nextTask:
      currentIndex < allTasks.length - 1 ? allTasks[currentIndex + 1] : null,
  };
}

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "pxlshpr";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "Chunes";
const SPRINT_PATH = ".claude/sprints";

export interface SprintTask {
  id: string;
  title: string;
  status: string;
  priority: string;
}

export interface DailyLogEntry {
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
  tasks: SprintTask[];
  dailyLog: DailyLogEntry[];
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
  tasks: SprintTask[];
}

async function fetchFileContent(path: string): Promise<string | null> {
  try {
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      ref: "main",
    });

    if ("content" in response.data) {
      return Buffer.from(response.data.content, "base64").toString("utf-8");
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

function extractTableRows(content: string, startMarker: string): string[][] {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => line.includes(startMarker));

  if (startIndex === -1) return [];

  const rows: string[][] = [];
  let inTable = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      if (line.includes("---")) {
        inTable = true;
        continue;
      }
      if (inTable) {
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim());
        rows.push(cells);
      }
    } else if (inTable && !line.startsWith("|")) {
      break;
    }
  }

  return rows;
}

function extractSection(content: string, header: string): string {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => line.includes(header));

  if (startIndex === -1) return "";

  let result = "";
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("##")) break;
    result += line + "\n";
  }

  return result.trim();
}

export async function parseCurrentSprint(): Promise<SprintData | null> {
  const content = await fetchFileContent(`${SPRINT_PATH}/current-sprint.md`);

  if (!content) return null;

  // Extract status
  const statusMatch = content.match(/\*\*Status\*\*:\s*(.+)/);
  const status = statusMatch ? statusMatch[1].trim() : "Unknown";

  // Extract block info
  const blockInfoRows = extractTableRows(content, "## Block Info");
  const blockInfo: Record<string, string> = {};
  blockInfoRows.forEach((row) => {
    if (row.length >= 2) {
      blockInfo[row[0].toLowerCase()] = row[1].replace(/`/g, "");
    }
  });

  // Extract tasks
  const taskRows = extractTableRows(content, "## Selected Tasks");
  const tasks: SprintTask[] = taskRows.map((row) => ({
    id: row[0] || "",
    title: row[1] || "",
    status: row[2] || "Unknown",
    priority: row[3] || "None",
  }));

  // Extract daily log
  const dailyLog: DailyLogEntry[] = [];
  const dayMatches = content.matchAll(
    /### Day (\d+) \(([^)]+)\)\n([\s\S]*?)(?=### Day|\n## |$)/g
  );
  for (const match of dayMatches) {
    const dayContent = match[3];
    const morningMatch = dayContent.match(/\*\*Morning standup\*\*:\s*(.*)/);
    const eodMatch = dayContent.match(/\*\*EOD summary\*\*:\s*(.*)/);
    const buildMatch = dayContent.match(/\*\*Build submitted\*\*:\s*(.*)/);

    dailyLog.push({
      day: parseInt(match[1]),
      date: match[2],
      morningStandup: morningMatch ? morningMatch[1].trim() : "-",
      eodSummary: eodMatch ? eodMatch[1].trim() : "-",
      buildSubmitted: buildMatch ? buildMatch[1].trim() : undefined,
    });
  }

  // Extract outcome
  const outcomeRows = extractTableRows(content, "## Block Outcome");
  const outcome: Record<string, string> = {};
  outcomeRows.forEach((row) => {
    if (row.length >= 2) {
      outcome[row[0].toLowerCase()] = row[1];
    }
  });

  return {
    status,
    blockNumber: parseInt(blockInfo["block number"]) || 1,
    blockLabel: blockInfo["block label"] || "",
    theme: blockInfo["theme"] || "",
    startDate: blockInfo["start date"] || "",
    endDate: blockInfo["end date"] || "",
    goal: extractSection(content, "## Block Goal"),
    tasks,
    dailyLog,
    blockers: extractSection(content, "## Blockers & Discoveries"),
    outcome: {
      tasksPlanned: parseInt(outcome["tasks planned"]) || 0,
      tasksCompleted: parseInt(outcome["tasks completed"]) || 0,
      buildVersion: outcome["build version"] || "-",
      submitted: outcome["submitted"] || "-",
    },
  };
}

export async function parsePlannedSprints(): Promise<PlannedBlock[]> {
  const content = await fetchFileContent(`${SPRINT_PATH}/planned-sprints.md`);

  if (!content) return [];

  const blocks: PlannedBlock[] = [];
  const blockMatches = content.matchAll(
    /## Block (\d+) - (\w+) \(([^)]+)\)\n\n\*\*Focus: ([^*]+)\*\*\n\n([\s\S]*?)(?=## Block|---|\n$)/g
  );

  for (const match of blockMatches) {
    const taskRows = extractTableRows(match[5], "| ID |");
    const tasks: SprintTask[] = taskRows.map((row) => ({
      id: row[0] || "",
      title: row[1] || "",
      status: "Planned",
      priority: row[2] || "None",
    }));

    blocks.push({
      number: parseInt(match[1]),
      name: match[2],
      dates: match[3],
      focus: match[4].trim(),
      tasks,
    });
  }

  return blocks;
}

export function calculateProgress(tasks: SprintTask[]): number {
  if (tasks.length === 0) return 0;

  const completedStatuses = ["Done", "Testing", "Completed"];
  const completed = tasks.filter((t) =>
    completedStatuses.some((s) => t.status.toLowerCase().includes(s.toLowerCase()))
  ).length;

  return Math.round((completed / tasks.length) * 100);
}

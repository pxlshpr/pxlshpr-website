import { Octokit } from '@octokit/rest';

// Types for Linear webhook payloads
export interface LinearWebhookPayload {
  action: 'create' | 'update' | 'remove';
  type: 'Issue' | 'Comment' | 'Label' | 'Project';
  data: LinearIssueData;
  createdAt: string;
  url?: string;
  updatedFrom?: Partial<LinearIssueData>;
}

export interface LinearIssueData {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  priority: number;
  priorityLabel?: string;
  state?: {
    id: string;
    name: string;
    type: string;
  };
  labels?: Array<{
    id: string;
    name: string;
  }>;
  url?: string;
  completedAt?: string;
  updatedAt: string;
}

// GitHub config
const GITHUB_OWNER = 'pxlshpr';
const GITHUB_REPO = 'NutriKit';
const GITHUB_BRANCH = 'main';
const SPRINTS_PATH = '.claude/sprints';

// Parse priority number to label
function parsePriorityLabel(priority: number): string {
  const priorityMap: Record<number, string> = {
    0: 'None',
    1: 'Urgent',
    2: 'High',
    3: 'Medium',
    4: 'Low',
  };
  return priorityMap[priority] || 'Medium';
}

// Parse status for markdown format
function parseStatusForMarkdown(stateName: string): string {
  const statusMap: Record<string, string> = {
    'Backlog': 'Backlog',
    'Todo': 'Todo',
    'Queue': 'Queue',
    'Prompt Ready': 'Ready',
    'Ready': 'Ready',
    'Running': 'Running',
    'Testing': 'Testing',
    'Done': 'Done',
    'Canceled': 'Canceled',
    'Cancelled': 'Canceled',
  };
  return statusMap[stateName] || stateName;
}

// Extract block label from labels array (e.g., "block-1-circe")
function extractBlockLabel(labels: Array<{ id: string; name: string }> | undefined): string | null {
  if (!labels) return null;
  for (const label of labels) {
    const match = label.name.match(/^block-(\d+)-(\w+)$/i);
    if (match) {
      return label.name.toLowerCase();
    }
  }
  return null;
}

// Parse block number from label
function parseBlockNumber(blockLabel: string): number {
  const match = blockLabel.match(/^block-(\d+)-/i);
  return match ? parseInt(match[1]) : 0;
}

// Get Octokit client
function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not set');
  }
  return new Octokit({ auth: token });
}

// Fetch file content from GitHub
async function fetchFileContent(octokit: Octokit, path: string): Promise<{ content: string; sha: string }> {
  const response = await octokit.repos.getContent({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    ref: GITHUB_BRANCH,
  });

  if ('content' in response.data && response.data.content) {
    return {
      content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
      sha: response.data.sha,
    };
  }
  throw new Error(`Failed to fetch ${path}`);
}

// Update file on GitHub
async function updateFileOnGitHub(
  octokit: Octokit,
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
    branch: GITHUB_BRANCH,
  });
}

// Check if task exists in markdown
function taskExistsInMarkdown(markdown: string, taskId: string): boolean {
  return markdown.includes(taskId);
}

// Update task in markdown (title, status, priority)
function updateTaskInMarkdown(
  markdown: string,
  taskId: string,
  updates: { title?: string; status?: string; priority?: string }
): string {
  const lines = markdown.split('\n');
  let inTasksTable = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## Selected Tasks') || lines[i].includes('| ID |')) {
      inTasksTable = true;
      continue;
    }

    if (inTasksTable && lines[i].startsWith('|') && lines[i].includes(taskId)) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 4) {
        // cells: [ID, Title, Status, Priority]
        if (updates.title !== undefined) cells[1] = updates.title;
        if (updates.status !== undefined) cells[2] = updates.status;
        if (updates.priority !== undefined) cells[3] = updates.priority;
        lines[i] = '| ' + cells.join(' | ') + ' |';
      }
      break;
    } else if (inTasksTable && lines[i].startsWith('##') && !lines[i].includes('## Selected Tasks')) {
      break;
    }
  }

  return lines.join('\n');
}

// Remove task from markdown
function removeTaskFromMarkdown(markdown: string, taskId: string): string {
  const lines = markdown.split('\n');
  const filteredLines = lines.filter(line => !line.includes(taskId));
  return filteredLines.join('\n');
}

// Add task to markdown
function addTaskToMarkdown(
  markdown: string,
  taskId: string,
  title: string,
  status: string,
  priority: string
): string {
  const lines = markdown.split('\n');
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## Selected Tasks')) {
      // Find the end of the tasks table
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('|') && !lines[j].includes('---') && !lines[j].includes('| ID |')) {
          insertIndex = j + 1;
        } else if (lines[j].startsWith('##') || (lines[j].trim() === '' && !lines[j + 1]?.startsWith('|'))) {
          break;
        }
      }
      break;
    }
  }

  if (insertIndex > 0) {
    const newRow = `| ${taskId} | ${title} | ${status} | ${priority} |`;
    lines.splice(insertIndex, 0, newRow);
  }

  return lines.join('\n');
}

// Update tasks completed count
function updateTasksCompletedCount(markdown: string): string {
  const lines = markdown.split('\n');
  let doneCount = 0;
  let inTasksTable = false;

  // Count Done tasks
  for (const line of lines) {
    if (line.includes('## Selected Tasks')) {
      inTasksTable = true;
      continue;
    }
    if (inTasksTable && line.startsWith('|') && !line.includes('---') && !line.includes('| ID |')) {
      if (line.includes('| Done |')) {
        doneCount++;
      }
    } else if (inTasksTable && line.startsWith('##')) {
      break;
    }
  }

  // Update the Tasks Completed row
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('| Tasks Completed |')) {
      lines[i] = `| Tasks Completed | ${doneCount} |`;
      break;
    }
  }

  return lines.join('\n');
}

// Update task in planned sprints (for title and priority updates)
function updateTaskInPlannedSprints(
  markdown: string,
  taskId: string,
  updates: { title?: string; priority?: string }
): string {
  const lines = markdown.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|') && lines[i].includes(taskId)) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 3) {
        // cells: [ID, Title, Priority]
        if (updates.title !== undefined) cells[1] = updates.title;
        if (updates.priority !== undefined) cells[2] = updates.priority;
        lines[i] = '| ' + cells.join(' | ') + ' |';
      }
      break;
    }
  }

  return lines.join('\n');
}

// Update last updated timestamp in planned-sprints.md
function updateLastUpdated(markdown: string): string {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return markdown.replace(/_Last updated: [^_]+_/, `_Last updated: ${dateStr}_`);
}

// Main sync function for issue updates
export async function syncIssueUpdate(payload: LinearWebhookPayload): Promise<{
  success: boolean;
  message: string;
  changes: string[];
}> {
  const changes: string[] = [];
  const { action, data, updatedFrom } = payload;

  if (payload.type !== 'Issue') {
    return { success: true, message: 'Ignoring non-issue webhook', changes: [] };
  }

  const taskId = data.identifier;
  const status = data.state?.name ? parseStatusForMarkdown(data.state.name) : undefined;
  const priority = parsePriorityLabel(data.priority);
  const title = data.title;
  const blockLabel = extractBlockLabel(data.labels);

  console.log(`[Linear Webhook] Processing ${action} for ${taskId}`);
  console.log(`[Linear Webhook] Block label: ${blockLabel}, Status: ${status}, Priority: ${priority}`);

  try {
    const octokit = getOctokit();

    // Fetch current sprint files from GitHub
    const [currentSprintFile, plannedSprintsFile] = await Promise.all([
      fetchFileContent(octokit, `${SPRINTS_PATH}/current-sprint.md`),
      fetchFileContent(octokit, `${SPRINTS_PATH}/planned-sprints.md`),
    ]);

    let currentSprint = currentSprintFile.content;
    let plannedSprints = plannedSprintsFile.content;
    let currentSprintChanged = false;
    let plannedSprintsChanged = false;

    // Get current block number from current-sprint.md
    const currentBlockMatch = currentSprint.match(/\| Block Number \| (\d+) \|/);
    const currentBlockNumber = currentBlockMatch ? parseInt(currentBlockMatch[1]) : 1;

    // Determine which file the task should be in
    const taskBlockNumber = blockLabel ? parseBlockNumber(blockLabel) : 0;
    const isInCurrentSprint = taskExistsInMarkdown(currentSprint, taskId);
    const isInPlannedSprints = taskExistsInMarkdown(plannedSprints, taskId);

    // Handle different scenarios
    if (action === 'remove') {
      // Remove task from wherever it exists
      if (isInCurrentSprint) {
        currentSprint = removeTaskFromMarkdown(currentSprint, taskId);
        currentSprint = updateTasksCompletedCount(currentSprint);
        currentSprintChanged = true;
        changes.push(`Removed ${taskId} from current block`);
      }
      if (isInPlannedSprints) {
        plannedSprints = removeTaskFromMarkdown(plannedSprints, taskId);
        plannedSprints = updateLastUpdated(plannedSprints);
        plannedSprintsChanged = true;
        changes.push(`Removed ${taskId} from planned blocks`);
      }
    } else if (action === 'create' || action === 'update') {
      // Check if we need to move the task between files
      const shouldBeInCurrent = taskBlockNumber === currentBlockNumber;
      const shouldBeInPlanned = taskBlockNumber > currentBlockNumber;

      // Handle label change (task moved to different block)
      if (updatedFrom?.labels && blockLabel) {
        const oldBlockLabel = extractBlockLabel(updatedFrom.labels as Array<{ id: string; name: string }>);
        if (oldBlockLabel !== blockLabel) {
          // Task moved to different block - remove from old location first
          if (isInCurrentSprint && !shouldBeInCurrent) {
            currentSprint = removeTaskFromMarkdown(currentSprint, taskId);
            currentSprint = updateTasksCompletedCount(currentSprint);
            currentSprintChanged = true;
            changes.push(`Removed ${taskId} from current block (label changed)`);
          }
          if (isInPlannedSprints && shouldBeInCurrent) {
            plannedSprints = removeTaskFromMarkdown(plannedSprints, taskId);
            plannedSprints = updateLastUpdated(plannedSprints);
            plannedSprintsChanged = true;
            changes.push(`Removed ${taskId} from planned blocks (moved to current)`);
          }
        }
      }

      // Update or add task in appropriate file
      if (shouldBeInCurrent) {
        if (taskExistsInMarkdown(currentSprint, taskId)) {
          currentSprint = updateTaskInMarkdown(currentSprint, taskId, { title, status, priority });
          changes.push(`Updated ${taskId} in current block: ${title} [${status}] (${priority})`);
        } else {
          currentSprint = addTaskToMarkdown(currentSprint, taskId, title, status || 'Ready', priority);
          changes.push(`Added ${taskId} to current block`);
        }
        currentSprint = updateTasksCompletedCount(currentSprint);
        currentSprintChanged = true;
      } else if (shouldBeInPlanned) {
        if (taskExistsInMarkdown(plannedSprints, taskId)) {
          plannedSprints = updateTaskInPlannedSprints(plannedSprints, taskId, { title, priority });
          changes.push(`Updated ${taskId} in planned blocks: ${title} (${priority})`);
        }
        // Note: We don't auto-add to planned sprints - that's managed manually
        plannedSprints = updateLastUpdated(plannedSprints);
        plannedSprintsChanged = true;
      } else if (isInCurrentSprint) {
        // Task doesn't have a block label but exists in current sprint - update it
        currentSprint = updateTaskInMarkdown(currentSprint, taskId, { title, status, priority });
        currentSprint = updateTasksCompletedCount(currentSprint);
        currentSprintChanged = true;
        changes.push(`Updated ${taskId} in current block: ${title} [${status}] (${priority})`);
      } else if (isInPlannedSprints) {
        // Task doesn't have a block label but exists in planned sprints - update it
        plannedSprints = updateTaskInPlannedSprints(plannedSprints, taskId, { title, priority });
        plannedSprints = updateLastUpdated(plannedSprints);
        plannedSprintsChanged = true;
        changes.push(`Updated ${taskId} in planned blocks: ${title} (${priority})`);
      }
    }

    // Commit changes to GitHub
    if (currentSprintChanged) {
      await updateFileOnGitHub(
        octokit,
        `${SPRINTS_PATH}/current-sprint.md`,
        currentSprint,
        currentSprintFile.sha,
        `[Auto] Linear sync: ${action} ${taskId} in current block`
      );
      console.log('[Linear Webhook] Updated current-sprint.md on GitHub');
    }

    if (plannedSprintsChanged) {
      // Need to re-fetch sha if current sprint was updated (commits change the tree)
      let plannedSha = plannedSprintsFile.sha;
      if (currentSprintChanged) {
        const refreshed = await fetchFileContent(octokit, `${SPRINTS_PATH}/planned-sprints.md`);
        plannedSha = refreshed.sha;
      }

      await updateFileOnGitHub(
        octokit,
        `${SPRINTS_PATH}/planned-sprints.md`,
        plannedSprints,
        plannedSha,
        `[Auto] Linear sync: ${action} ${taskId} in planned blocks`
      );
      console.log('[Linear Webhook] Updated planned-sprints.md on GitHub');
    }

    return {
      success: true,
      message: `Processed ${action} for ${taskId}`,
      changes,
    };
  } catch (error) {
    console.error('[Linear Webhook] Sync error:', error);
    return {
      success: false,
      message: `Failed to sync: ${error}`,
      changes,
    };
  }
}

// Verify Linear webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    console.warn('[Linear Webhook] Missing signature or secret');
    return false;
  }

  // Linear uses HMAC-SHA256
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

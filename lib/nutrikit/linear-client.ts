import { LinearClient } from '@linear/sdk';

// Types for task details
export interface TaskComment {
  id: string;
  body: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

export interface LinearDocument {
  id: string;
  title: string;
  url: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetails {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  priorityLabel: string;
  estimate?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  branchName?: string;
  labels: string[];
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
  creator?: {
    name: string;
  };
  project?: {
    name: string;
    icon?: string;
  };
  comments: TaskComment[];
  attachments: {
    id: string;
    title: string;
    url: string;
  }[];
  documents: LinearDocument[];
}

// Create Linear client
function getLinearClient(): LinearClient {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }
  return new LinearClient({ apiKey });
}

// Fetch task details by identifier (e.g., "PXL-833")
export async function fetchTaskDetails(identifier: string): Promise<TaskDetails | null> {
  try {
    const client = getLinearClient();

    // Search for the issue by identifier
    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(identifier.split('-')[1]) },
        team: { key: { eq: identifier.split('-')[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      return null;
    }

    // Fetch related data
    const [state, assignee, creator, project, labels, comments, attachments] = await Promise.all([
      issue.state,
      issue.assignee,
      issue.creator,
      issue.project,
      issue.labels(),
      issue.comments(),
      issue.attachments(),
    ]);

    // Map priority number to label
    const priorityLabels: Record<number, string> = {
      0: 'No priority',
      1: 'Urgent',
      2: 'High',
      3: 'Medium',
      4: 'Low',
    };

    // Process comments
    const processedComments: TaskComment[] = [];
    for (const comment of comments.nodes) {
      const user = await comment.user;
      processedComments.push({
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        user: {
          name: user?.name || 'Unknown',
          avatarUrl: user?.avatarUrl || undefined,
        },
      });
    }

    // Parse Linear document links from description
    const processedDocuments: LinearDocument[] = [];
    const description = issue.description || '';
    const documentLinkPattern = /\[([^\]]+)\]\((https:\/\/linear\.app\/[^\/]+\/document\/[^-]+-([a-f0-9]+))\)/g;
    const matches = [...description.matchAll(documentLinkPattern)];

    for (const match of matches) {
      const linkText = match[1];
      const linkUrl = match[2];
      const docId = match[3];

      try {
        const doc = await client.document(docId);
        processedDocuments.push({
          id: doc.id,
          title: doc.title,
          url: doc.url,
          content: doc.content || undefined,
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt.toISOString(),
        });
      } catch (error) {
        console.error(`Failed to fetch Linear document ${docId}:`, error);
        // If we can't fetch the document, at least include the link info
        processedDocuments.push({
          id: docId,
          title: linkText,
          url: linkUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description || undefined,
      status: (await state)?.name || 'Unknown',
      priority: issue.priority,
      priorityLabel: priorityLabels[issue.priority] || 'Medium',
      estimate: issue.estimate || undefined,
      dueDate: issue.dueDate || undefined,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      url: issue.url,
      branchName: issue.branchName || undefined,
      labels: labels.nodes.map(l => l.name),
      assignee: assignee
        ? {
            name: assignee.name,
            avatarUrl: assignee.avatarUrl || undefined,
          }
        : undefined,
      creator: creator
        ? {
            name: creator.name,
          }
        : undefined,
      project: project
        ? {
            name: project.name,
            icon: project.icon || undefined,
          }
        : undefined,
      comments: processedComments,
      attachments: attachments.nodes.map(a => ({
        id: a.id,
        title: a.title,
        url: a.url,
      })),
      documents: processedDocuments,
    };
  } catch (error) {
    console.error('Failed to fetch task details:', error);
    throw error;
  }
}

// Get status color class
export function getStatusColorClass(status: string): string {
  const colors: Record<string, string> = {
    'Backlog': 'bg-muted-foreground/30 text-muted',
    'Todo': 'bg-white/10 text-foreground',
    'Queue': 'bg-white/15 text-foreground',
    'Ready': 'bg-accent/20 text-accent-light border-accent/30',
    'Running': 'bg-protein/20 text-protein-light border-protein/30',
    'Testing': 'bg-carbs/20 text-carbs-light border-carbs/30',
    'Done': 'bg-success/20 text-success-light border-success/30',
    'Canceled': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || colors['Backlog'];
}

// Get priority color class
export function getPriorityColorClass(priority: number): string {
  const colors: Record<number, string> = {
    1: 'text-red-400',
    2: 'text-orange-400',
    3: 'text-carbs',
    4: 'text-muted',
    0: 'text-muted-foreground',
  };
  return colors[priority] || colors[3];
}

// Interface for completed task with timestamp
export interface CompletedTask {
  id: string;
  identifier: string;
  title: string;
  completedAt: string;
  priority: number;
  url: string;
}

// Interface for live task status
export interface LiveTaskStatus {
  identifier: string;
  title: string;
  status: string;
  priority: number;
  updatedAt: string;
}

// Fetch live statuses for multiple task IDs
export async function fetchLiveTaskStatuses(taskIds: string[]): Promise<Map<string, LiveTaskStatus>> {
  const statusMap = new Map<string, LiveTaskStatus>();

  if (taskIds.length === 0) return statusMap;

  try {
    const client = getLinearClient();

    // Fetch all tasks in parallel
    const promises = taskIds.map(async (id) => {
      const parts = id.split('-');
      if (parts.length !== 2) return null;

      const issues = await client.issues({
        filter: {
          number: { eq: parseInt(parts[1]) },
          team: { key: { eq: parts[0] } },
        },
        first: 1,
      });

      const issue = issues.nodes[0];
      if (!issue) return null;

      const state = await issue.state;
      return {
        identifier: issue.identifier,
        title: issue.title,
        status: state?.name || 'Unknown',
        priority: issue.priority,
        updatedAt: issue.updatedAt.toISOString(),
      };
    });

    const results = await Promise.all(promises);

    for (const result of results) {
      if (result) {
        statusMap.set(result.identifier, result);
      }
    }

    return statusMap;
  } catch (error) {
    console.error('Failed to fetch live task statuses:', error);
    return statusMap;
  }
}

// Fetch completed tasks for specific task IDs
export async function fetchCompletedTasksForIds(taskIds: string[]): Promise<CompletedTask[]> {
  if (taskIds.length === 0) return [];

  try {
    const client = getLinearClient();
    const completedTasks: CompletedTask[] = [];

    // Fetch each task and check if it's done
    const promises = taskIds.map(async (id) => {
      const parts = id.split('-');
      if (parts.length !== 2) return null;

      const issues = await client.issues({
        filter: {
          number: { eq: parseInt(parts[1]) },
          team: { key: { eq: parts[0] } },
        },
        first: 1,
      });

      const issue = issues.nodes[0];
      if (!issue) return null;

      const state = await issue.state;
      if (state?.name === 'Done' && issue.completedAt) {
        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          completedAt: issue.completedAt.toISOString(),
          priority: issue.priority,
          url: issue.url,
        };
      }
      return null;
    });

    const results = await Promise.all(promises);

    for (const result of results) {
      if (result) {
        completedTasks.push(result);
      }
    }

    // Sort by completion time (earliest to latest)
    completedTasks.sort((a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    return completedTasks;
  } catch (error) {
    console.error('Failed to fetch completed tasks:', error);
    return [];
  }
}

// Update task description
export async function updateTaskDescription(identifier: string, description: string): Promise<boolean> {
  try {
    const client = getLinearClient();

    // Search for the issue by identifier
    const parts = identifier.split('-');
    if (parts.length !== 2) {
      throw new Error('Invalid identifier format');
    }

    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(parts[1]) },
        team: { key: { eq: parts[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      throw new Error(`Task ${identifier} not found`);
    }

    await issue.update({ description });
    return true;
  } catch (error) {
    console.error(`Failed to update task ${identifier}:`, error);
    return false;
  }
}

// Legacy function - kept for backwards compatibility
export async function fetchCompletedTasksForSprint(sprintLabel: string): Promise<CompletedTask[]> {
  try {
    const client = getLinearClient();

    // Fetch tasks with the sprint label
    const issues = await client.issues({
      filter: {
        labels: {
          name: { eq: sprintLabel },
        },
        state: {
          name: { eq: 'Done' },
        },
      },
    });

    const completedTasks: CompletedTask[] = [];

    for (const issue of issues.nodes) {
      if (issue.completedAt) {
        completedTasks.push({
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          completedAt: issue.completedAt.toISOString(),
          priority: issue.priority,
          url: issue.url,
        });
      }
    }

    // Sort by completion time (earliest to latest)
    completedTasks.sort((a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    return completedTasks;
  } catch (error) {
    console.error('Failed to fetch completed tasks:', error);
    return [];
  }
}

// Fetch a Linear document by ID
export async function fetchDocumentById(docId: string): Promise<LinearDocument | null> {
  try {
    const client = getLinearClient();
    const doc = await client.document(docId);

    return {
      id: doc.id,
      title: doc.title,
      url: doc.url,
      content: doc.content || undefined,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to fetch document ${docId}:`, error);
    return null;
  }
}

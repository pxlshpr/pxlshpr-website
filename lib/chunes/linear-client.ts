import { LinearClient } from "@linear/sdk";

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
  description: string | null;
  status: string;
  priority: number;
  priorityLabel: string;
  estimate: number | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  url: string;
  branchName?: string;
  labels: string[];
  assignee: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
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
    throw new Error("LINEAR_API_KEY environment variable is not set");
  }
  return new LinearClient({ apiKey });
}

// Fetch task details by identifier (e.g., "PXL-833")
export async function fetchTaskDetails(
  identifier: string
): Promise<TaskDetails | null> {
  try {
    const client = getLinearClient();

    // Search for the issue by identifier
    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(identifier.split("-")[1]) },
        team: { key: { eq: identifier.split("-")[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      return null;
    }

    // Fetch related data
    const [state, assignee, creator, project, labels, comments, attachments] =
      await Promise.all([
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
      0: "No priority",
      1: "Urgent",
      2: "High",
      3: "Medium",
      4: "Low",
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
          name: user?.name || "Unknown",
          avatarUrl: user?.avatarUrl || undefined,
        },
      });
    }

    // Parse Linear document links from description
    const processedDocuments: LinearDocument[] = [];
    const description = issue.description || "";
    const documentLinkPattern =
      /\[([^\]]+)\]\((https:\/\/linear\.app\/[^\/]+\/document\/[^-]+-([a-f0-9]+))\)/g;
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
      description: issue.description || null,
      status: (await state)?.name || "Unknown",
      priority: issue.priority,
      priorityLabel: priorityLabels[issue.priority] || "Medium",
      estimate: issue.estimate || null,
      dueDate: issue.dueDate || null,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      completedAt: issue.completedAt?.toISOString() || null,
      url: issue.url,
      branchName: issue.branchName || undefined,
      labels: labels.nodes.map((l) => l.name),
      assignee: assignee
        ? {
            id: assignee.id,
            name: assignee.name,
            avatarUrl: assignee.avatarUrl || null,
          }
        : null,
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
      attachments: attachments.nodes.map((a) => ({
        id: a.id,
        title: a.title,
        url: a.url,
      })),
      documents: processedDocuments,
    };
  } catch (error) {
    console.error("Failed to fetch task details:", error);
    throw error;
  }
}

// Get status color class for Chunes styling
export function getStatusColorClass(status: string): string {
  const colors: Record<string, string> = {
    Backlog: "bg-[var(--foreground-tertiary)]/20 text-[var(--foreground-tertiary)]",
    Todo: "bg-[var(--foreground-secondary)]/20 text-[var(--foreground-secondary)]",
    Queue: "bg-[var(--foreground-secondary)]/20 text-[var(--foreground-secondary)]",
    Ready: "tag-pill tag-genre",
    "In Progress": "tag-pill tag-mood",
    Running: "tag-pill tag-mood",
    Testing: "tag-pill tag-activity",
    Done: "tag-pill tag-teal",
    Canceled: "bg-red-500/20 text-red-400",
    Cancelled: "bg-red-500/20 text-red-400",
  };
  return colors[status] || colors["Backlog"];
}

// Get priority color class for Chunes styling
export function getPriorityColorClass(priority: number): string {
  const colors: Record<number, string> = {
    1: "text-red-400",
    2: "text-orange-400",
    3: "text-[var(--accent-tertiary)]",
    4: "text-[var(--foreground-tertiary)]",
    0: "text-[var(--foreground-tertiary)]",
  };
  return colors[priority] || colors[3];
}

// Fetch live statuses for multiple task IDs
export async function fetchLiveTaskStatuses(
  taskIds: string[]
): Promise<Map<string, { status: string; statusType: string; color: string }>> {
  const statusMap = new Map();

  try {
    const client = getLinearClient();

    for (const id of taskIds) {
      const parts = id.split("-");
      if (parts.length !== 2) continue;

      const issues = await client.issues({
        filter: {
          number: { eq: parseInt(parts[1]) },
          team: { key: { eq: parts[0] } },
        },
        first: 1,
      });

      const issue = issues.nodes[0];
      if (issue) {
        const state = await issue.state;
        if (state) {
          statusMap.set(id, {
            status: state.name,
            statusType: state.type,
            color: state.color,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching task statuses:", error);
  }

  return statusMap;
}

// Fetch a Linear document by ID
export async function fetchDocumentById(
  docId: string
): Promise<LinearDocument | null> {
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

// Interface for sprint task (used for navigation)
export interface SprintTask {
  id: string;
  title: string;
  status: string;
  priority: string;
}

// Fetch sprint task list for navigation
export async function fetchSprintTaskList(): Promise<SprintTask[]> {
  // This would normally fetch from GitHub/sprint file
  // For now, return an empty array - navigation will be disabled
  return [];
}

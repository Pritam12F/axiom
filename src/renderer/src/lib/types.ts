export type AgentStatus = "running" | "idle" | "sleeping" | "needs-approval" | "error"

export type MachineSize = "small" | "medium" | "large"

export interface Machine {
  size: MachineSize
  vcpu: number
  memoryGb: number
  diskGb: number
  region: string
  baseImage: string
  ip: string
  costPerHour: number
  cpuHistory: number[] // sparkline samples, 0-100
  memoryPercent: number
  diskPercent: number
}

export interface Agent {
  id: string
  name: string
  avatarColor: string
  status: AgentStatus
  groupId: string
  projectId: string | null
  currentTask: string | null
  uptimeMinutes: number
  machine: Machine
  role: "Planner" | "Worker" | "Reviewer"
}

export type EventKind = "thought" | "shell" | "file-edit" | "git" | "test" | "message"

export interface AgentEvent {
  id: string
  agentId: string
  kind: EventKind
  title: string
  detail?: string
  timestamp: string // ISO
}

export type PrStatus = "none" | "draft" | "open" | "review" | "merged"

export type TaskColumn = "planned" | "in-progress" | "in-review" | "done"

export interface Task {
  id: string
  projectId: string
  title: string
  column: TaskColumn
  assigneeAgentId: string | null
  branch: string | null
  prStatus: PrStatus
  prNumber?: number
}

export interface Project {
  id: string
  name: string
  repo: string
  defaultBranch: string
  groupId: string | null
  lastActivity: string
  description: string
}

export interface Group {
  id: string
  name: string
  color: string
  projectId: string | null
  memberIds: string[]
}

export type RiskLevel = "low" | "medium" | "high"

export interface ApprovalRequest {
  id: string
  agentId: string
  projectId: string
  command: string
  reason: string
  risk: RiskLevel
  createdAt: string
  status: "pending" | "approved" | "denied"
}

export interface ActivityFeedItem {
  id: string
  agentId: string
  message: string
  timestamp: string
}

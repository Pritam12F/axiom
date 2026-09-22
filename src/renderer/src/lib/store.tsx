'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  agents as initialAgents,
  projects as initialProjects,
  groups as initialGroups,
  tasks as initialTasks,
  approvalRequests as initialApprovals,
  activityFeed as initialActivity,
  dailyBudget,
  spendToday
} from './mock-data'
import type {
  Agent,
  AgentStatus,
  ApprovalRequest,
  Group,
  Project,
  Task,
  TaskColumn,
  ActivityFeedItem,
  MachineSize
} from './types'

type View =
  | { name: 'overview' }
  | { name: 'agents' }
  | { name: 'agent-detail'; agentId: string }
  | { name: 'projects' }
  | { name: 'groups'; groupId?: string }
  | { name: 'approvals' }

interface FleetState {
  agents: Agent[]
  projects: Project[]
  groups: Group[]
  tasks: Task[]
  approvals: ApprovalRequest[]
  activity: ActivityFeedItem[]
  view: View
  fleetPaused: boolean
  dailyBudget: number
  spendToday: number
}

interface FleetContextValue extends FleetState {
  setView: (v: View) => void
  goToAgent: (agentId: string) => void
  setAgentStatus: (agentId: string, status: AgentStatus) => void
  pauseAgent: (agentId: string) => void
  restartAgent: (agentId: string) => void
  stopAgent: (agentId: string) => void
  snapshotAgent: (agentId: string) => void
  approveRequest: (id: string) => void
  denyRequest: (id: string) => void
  assignProjectToGroup: (projectId: string, groupId: string) => void
  moveTask: (taskId: string, column: TaskColumn) => void
  pauseAll: () => void
  resumeAll: () => void
  killSwitch: () => void
  addAgent: (input: {
    name: string
    groupId: string
    size: MachineSize
    region: string
    baseImage: string
  }) => void
  addProject: (input: {
    name: string
    repo: string
    defaultBranch: string
    description: string
  }) => void
  pendingApprovalCount: number
}

const FleetContext = React.createContext<FleetContextValue | null>(null)

const MACHINE_SPECS: Record<
  MachineSize,
  { vcpu: number; memoryGb: number; diskGb: number; costPerHour: number }
> = {
  small: { vcpu: 2, memoryGb: 4, diskGb: 40, costPerHour: 0.11 },
  medium: { vcpu: 4, memoryGb: 8, diskGb: 60, costPerHour: 0.21 },
  large: { vcpu: 8, memoryGb: 16, diskGb: 100, costPerHour: 0.42 }
}

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = React.useState<Agent[]>(initialAgents)
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [groups, setGroups] = React.useState<Group[]>(initialGroups)
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [approvals, setApprovals] = React.useState<ApprovalRequest[]>(initialApprovals)
  const [activity, setActivity] = React.useState<ActivityFeedItem[]>(initialActivity)
  const [view, setView] = React.useState<View>({ name: 'overview' })
  const [fleetPaused, setFleetPaused] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const newRequest: ApprovalRequest = {
        id: `appr-${Math.floor(Math.random() * 100000)}`,
        agentId: 'agt-vega',
        projectId: 'proj-webapp',
        command: 'npm publish --access public',
        reason: 'Publishing the updated design-tokens package after the pricing table refactor.',
        risk: 'medium',
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      setApprovals((prev) => [newRequest, ...prev])
      toast('vega needs your approval', {
        description: newRequest.command,
        action: { label: 'Review', onClick: () => setView({ name: 'approvals' }) }
      })
    }, 20_000)
    return () => clearTimeout(timer)
  }, [])

  const goToAgent = React.useCallback((agentId: string) => {
    setView({ name: 'agent-detail', agentId })
  }, [])

  const setAgentStatus = React.useCallback((agentId: string, status: AgentStatus) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status } : a)))
  }, [])

  const pauseAgent = React.useCallback(
    (agentId: string) => {
      setAgentStatus(agentId, 'idle')
      const agent = agents.find((a) => a.id === agentId)
      toast(`${agent?.name ?? 'Agent'} paused`, {
        description: 'The agent will finish its current step and idle.'
      })
    },
    [agents, setAgentStatus]
  )

  const restartAgent = React.useCallback(
    (agentId: string) => {
      setAgentStatus(agentId, 'running')
      const agent = agents.find((a) => a.id === agentId)
      toast(`${agent?.name ?? 'Agent'} restarted`, {
        description: 'Machine rebooted and session resumed.'
      })
    },
    [agents, setAgentStatus]
  )

  const stopAgent = React.useCallback(
    (agentId: string) => {
      setAgentStatus(agentId, 'sleeping')
      const agent = agents.find((a) => a.id === agentId)
      toast(`${agent?.name ?? 'Agent'} stopped`, { description: 'Machine has been powered down.' })
    },
    [agents, setAgentStatus]
  )

  const snapshotAgent = React.useCallback(
    (agentId: string) => {
      const agent = agents.find((a) => a.id === agentId)
      toast(`Snapshot created for ${agent?.name ?? 'agent'}`, {
        description: 'You can restore this machine state at any time.'
      })
    },
    [agents]
  )

  const approveRequest = React.useCallback(
    (id: string) => {
      setApprovals((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
      const req = approvals.find((r) => r.id === id)
      if (req) {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === req.agentId && a.status === 'needs-approval' ? { ...a, status: 'running' } : a
          )
        )
        toast.success('Request approved', { description: req.command })
      }
    },
    [approvals]
  )

  const denyRequest = React.useCallback(
    (id: string) => {
      setApprovals((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'denied' } : r)))
      const req = approvals.find((r) => r.id === id)
      if (req) {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === req.agentId && a.status === 'needs-approval' ? { ...a, status: 'idle' } : a
          )
        )
        toast.error('Request denied', { description: req.command })
      }
    },
    [approvals]
  )

  const assignProjectToGroup = React.useCallback(
    (projectId: string, groupId: string) => {
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, groupId } : p)))
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          projectId: g.id === groupId ? projectId : g.projectId === projectId ? null : g.projectId
        }))
      )
      const project = projects.find((p) => p.id === projectId)
      const group = groups.find((g) => g.id === groupId)
      toast(`${project?.name ?? 'Project'} assigned to ${group?.name ?? 'group'}`)
    },
    [projects, groups]
  )

  const moveTask = React.useCallback((taskId: string, column: TaskColumn) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, column } : t)))
  }, [])

  const pauseAll = React.useCallback(() => {
    setFleetPaused(true)
    setAgents((prev) => prev.map((a) => (a.status === 'running' ? { ...a, status: 'idle' } : a)))
    toast('All agents paused', { description: 'Every running agent has been idled.' })
  }, [])

  const resumeAll = React.useCallback(() => {
    setFleetPaused(false)
    toast('Fleet resumed')
  }, [])

  const killSwitch = React.useCallback(() => {
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'sleeping' as AgentStatus })))
    setFleetPaused(true)
    toast.error('Kill switch activated', { description: 'All agent machines have been stopped.' })
  }, [])

  const addAgent = React.useCallback(
    (input: {
      name: string
      groupId: string
      size: MachineSize
      region: string
      baseImage: string
    }) => {
      const spec = MACHINE_SPECS[input.size]
      const colors = ['#6366f1', '#22c55e', '#0ea5e9', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b']
      const newAgent: Agent = {
        id: `agt-${input.name.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`,
        name: input.name,
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        status: 'idle',
        groupId: input.groupId,
        projectId: groups.find((g) => g.id === input.groupId)?.projectId ?? null,
        currentTask: null,
        uptimeMinutes: 0,
        role: 'Worker',
        machine: {
          size: input.size,
          vcpu: spec.vcpu,
          memoryGb: spec.memoryGb,
          diskGb: spec.diskGb,
          region: input.region,
          baseImage: input.baseImage,
          ip: `10.42.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 254)}`,
          costPerHour: spec.costPerHour,
          cpuHistory: Array.from({ length: 20 }, () => Math.floor(Math.random() * 10) + 2),
          memoryPercent: 4,
          diskPercent: 2
        }
      }
      setAgents((prev) => [newAgent, ...prev])
      setGroups((prev) =>
        prev.map((g) =>
          g.id === input.groupId ? { ...g, memberIds: [...g.memberIds, newAgent.id] } : g
        )
      )
      toast.success(`${newAgent.name} provisioned`, {
        description: `${spec.vcpu} vCPU · ${spec.memoryGb} GB · ${input.region}`
      })
    },
    [groups]
  )

  const addProject = React.useCallback(
    (input: { name: string; repo: string; defaultBranch: string; description: string }) => {
      const newProject: Project = {
        id: `proj-${input.name.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`,
        name: input.name,
        repo: input.repo,
        defaultBranch: input.defaultBranch,
        groupId: null,
        lastActivity: 'just now',
        description: input.description
      }
      setProjects((prev) => [newProject, ...prev])
      toast.success(`${newProject.name} created`, {
        description: 'Assign it to a group to get started.'
      })
    },
    []
  )

  const pendingApprovalCount = approvals.filter((a) => a.status === 'pending').length

  const value: FleetContextValue = {
    agents,
    projects,
    groups,
    tasks,
    approvals,
    activity,
    view,
    fleetPaused,
    dailyBudget,
    spendToday,
    setView,
    goToAgent,
    setAgentStatus,
    pauseAgent,
    restartAgent,
    stopAgent,
    snapshotAgent,
    approveRequest,
    denyRequest,
    assignProjectToGroup,
    moveTask,
    pauseAll,
    resumeAll,
    killSwitch,
    addAgent,
    addProject,
    pendingApprovalCount
  }

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleet() {
  const ctx = React.useContext(FleetContext)
  if (!ctx) throw new Error('useFleet must be used within FleetProvider')
  return ctx
}

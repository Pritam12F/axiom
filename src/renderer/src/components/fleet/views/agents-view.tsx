"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { useFleet } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AgentAvatar } from "@/components/fleet/agent-avatar"
import { StatusLabel } from "@/components/fleet/status-dot"
import { formatUptime } from "@/lib/format"
import type { AgentStatus } from "@/lib/types"

const STATUS_FILTERS: { value: AgentStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "running", label: "Running" },
  { value: "idle", label: "Idle" },
  { value: "sleeping", label: "Sleeping" },
  { value: "needs-approval", label: "Needs approval" },
  { value: "error", label: "Error" },
]

export function AgentsView({ onNewAgent }: { onNewAgent: () => void }) {
  const { agents, groups, projects, goToAgent } = useFleet()
  const [status, setStatus] = React.useState<string>("all")
  const [groupId, setGroupId] = React.useState<string>("all")
  const [projectId, setProjectId] = React.useState<string>("all")

  const filtered = agents.filter((a) => {
    if (status !== "all" && a.status !== status) return false
    if (groupId !== "all" && a.groupId !== groupId) return false
    if (projectId !== "all" && a.projectId !== projectId) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue>{(v: string) => STATUS_FILTERS.find((f) => f.value === v)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATUS_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={groupId} onValueChange={(v) => v && setGroupId(v)}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue>{(v: string) => (v === "all" ? "All groups" : groups.find((g) => g.id === v)?.name)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All groups</SelectItem>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={projectId} onValueChange={(v) => v && setProjectId(v)}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue>{(v: string) => (v === "all" ? "All projects" : projects.find((p) => p.id === v)?.name)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={onNewAgent}>
          <Plus data-icon="inline-start" />
          New agent
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Machine</TableHead>
              <TableHead className="text-right">Uptime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((agent) => {
              const group = groups.find((g) => g.id === agent.groupId)
              const project = projects.find((p) => p.id === agent.projectId)
              return (
                <TableRow key={agent.id} className="cursor-pointer" onClick={() => goToAgent(agent.id)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AgentAvatar agent={agent} />
                      <span className="font-medium text-foreground">{agent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusLabel status={agent.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{group?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{project?.name ?? "—"}</TableCell>
                  <TableCell className="max-w-64 truncate text-muted-foreground">{agent.currentTask ?? "—"}</TableCell>
                  <TableCell className="tabular text-muted-foreground">
                    {agent.machine.vcpu} vCPU · {agent.machine.memoryGb} GB
                  </TableCell>
                  <TableCell className="tabular text-right text-muted-foreground">{formatUptime(agent.uptimeMinutes)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

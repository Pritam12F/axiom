'use client'

import { ArrowLeft, Camera, Pause, Play, Square } from 'lucide-react'
import { useFleet } from '@renderer/lib/store'
import { Button } from '@renderer/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { AgentAvatar } from '@renderer/components/fleet/agent-avatar'
import { StatusLabel } from '@renderer/components/fleet/status-dot'
import { ActivityTab } from '@renderer/components/fleet/agent-detail/activity-tab'
import { TerminalTab } from '@renderer/components/fleet/agent-detail/terminal-tab'
import { ChangesTab } from '@renderer/components/fleet/agent-detail/changes-tab'
import { MachineTab } from '@renderer/components/fleet/agent-detail/machine-tab'
import { agentEvents, terminalOutput, diffsByAgent } from '@renderer/lib/mock-data'
import { formatUptime } from '@renderer/lib/format'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from '@renderer/components/ui/empty'
import { Bot } from 'lucide-react'

export function AgentDetailView({ agentId }: { agentId: string }) {
  const { agents, groups, projects, setView, pauseAgent, restartAgent, stopAgent, snapshotAgent } =
    useFleet()
  const agent = agents.find((a) => a.id === agentId)

  if (!agent) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bot />
          </EmptyMedia>
          <EmptyTitle>Agent not found</EmptyTitle>
          <EmptyDescription>This agent may have been removed.</EmptyDescription>
        </EmptyHeader>
        <Button size="sm" variant="outline" onClick={() => setView({ name: 'agents' })}>
          Back to Agents
        </Button>
      </Empty>
    )
  }

  const group = groups.find((g) => g.id === agent.groupId)
  const project = projects.find((p) => p.id === agent.projectId)
  const events = agentEvents.filter((e) => e.agentId === agent.id)
  const lines = terminalOutput[agent.id] ?? []
  const diffs = diffsByAgent[agent.id] ?? []

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 border-b border-border p-5">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-muted-foreground"
          onClick={() => setView({ name: 'agents' })}
        >
          <ArrowLeft data-icon="inline-start" />
          Agents
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <AgentAvatar agent={agent} className="size-10" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{agent.name}</h2>
                <StatusLabel status={agent.status} />
              </div>
              <p className="tabular text-xs text-muted-foreground">
                {agent.machine.vcpu} vCPU · {agent.machine.memoryGb} GB · {agent.machine.region} ·
                uptime {formatUptime(agent.uptimeMinutes)}
                {group && <> · {group.name}</>}
                {project && <> · {project.name}</>}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => pauseAgent(agent.id)}>
              <Pause data-icon="inline-start" />
              Pause
            </Button>
            <Button size="sm" variant="outline" onClick={() => restartAgent(agent.id)}>
              <Play data-icon="inline-start" />
              Restart
            </Button>
            <Button size="sm" variant="outline" onClick={() => snapshotAgent(agent.id)}>
              <Camera data-icon="inline-start" />
              Snapshot
            </Button>
            <Button size="sm" variant="destructive" onClick={() => stopAgent(agent.id)}>
              <Square data-icon="inline-start" />
              Stop
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="activity" className="flex-1">
        <div className="border-b border-border px-5">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="changes">Changes</TabsTrigger>
            <TabsTrigger value="machine">Machine</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="activity">
          <ActivityTab events={events} />
        </TabsContent>
        <TabsContent value="terminal">
          <TerminalTab lines={lines} agentName={agent.name} />
        </TabsContent>
        <TabsContent value="changes">
          <ChangesTab diffs={diffs} />
        </TabsContent>
        <TabsContent value="machine">
          <MachineTab agent={agent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

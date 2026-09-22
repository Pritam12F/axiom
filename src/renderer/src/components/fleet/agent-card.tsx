'use client'

import { Cpu, MapPin } from 'lucide-react'
import { useFleet } from '@renderer/lib/store'
import { AgentAvatar } from '@renderer/components/fleet/agent-avatar'
import { StatusLabel } from '@renderer/components/fleet/status-dot'
import { Sparkline } from '@renderer/components/fleet/sparkline'
import { formatUptime } from '@renderer/lib/format'
import type { Agent } from '@renderer/lib/types'

export function AgentCard({ agent }: { agent: Agent }) {
  const { goToAgent } = useFleet()
  const cpuNow = agent.machine.cpuHistory[agent.machine.cpuHistory.length - 1]

  return (
    <button
      onClick={() => goToAgent(agent.id)}
      className="group flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3.5 text-left transition-colors duration-150 hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AgentAvatar agent={agent} />
          <span className="truncate text-[13px] font-semibold text-foreground">{agent.name}</span>
        </div>
        <StatusLabel status={agent.status} />
      </div>

      <p className="line-clamp-1 text-xs text-muted-foreground">
        {agent.currentTask ?? 'No active task'}
      </p>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <MapPin className="size-3" />
        <span className="tabular">
          {agent.machine.vcpu} vCPU · {agent.machine.memoryGb} GB · {agent.machine.region}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="tabular text-[11px] text-muted-foreground">
          Uptime {formatUptime(agent.uptimeMinutes)}
        </span>
        <div className="flex items-center gap-1.5">
          <Cpu className="size-3 text-muted-foreground" />
          <span className="tabular text-[11px] text-muted-foreground">{cpuNow}%</span>
          <Sparkline
            data={agent.machine.cpuHistory}
            strokeClassName={
              agent.status === 'error'
                ? 'stroke-status-error'
                : agent.status === 'running'
                  ? 'stroke-primary'
                  : 'stroke-muted-foreground'
            }
          />
        </div>
      </div>
    </button>
  )
}

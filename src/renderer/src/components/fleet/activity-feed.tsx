'use client'

import { useFleet } from '@renderer/lib/store'
import { AgentAvatar } from '@renderer/components/fleet/agent-avatar'
import { TimeAgo } from '@renderer/components/fleet/time-ago'

export function ActivityFeed() {
  const { activity, agents, goToAgent } = useFleet()

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-[13px] font-semibold text-foreground">Live activity</h2>
        <p className="text-xs text-muted-foreground">What the fleet has been doing</p>
      </div>
      <ol className="flex flex-col">
        {activity.map((item) => {
          const agent = agents.find((a) => a.id === item.agentId)
          if (!agent) return null
          return (
            <li key={item.id}>
              <button
                onClick={() => goToAgent(agent.id)}
                className="flex w-full items-start gap-2.5 border-b border-border px-4 py-2.5 text-left transition-colors duration-150 last:border-b-0 hover:bg-accent/40"
              >
                <AgentAvatar agent={agent} className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-snug text-foreground">{item.message}</p>
                  <TimeAgo
                    iso={item.timestamp}
                    className="tabular mt-0.5 block text-[11px] text-muted-foreground"
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

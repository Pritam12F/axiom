import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { AgentAvatar } from '@renderer/components/fleet/agent-avatar'
import type { Agent } from '@renderer/lib/types'

export function MemberChip({ agent }: { agent: Agent }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-card py-0.5 pl-0.5 pr-2.5" />
        }
      >
        <AgentAvatar agent={agent} />
        <span className="text-[11px] font-medium text-foreground">{agent.name}</span>
        <span className="text-[10px] text-muted-foreground">{agent.role}</span>
      </TooltipTrigger>
      <TooltipContent>
        {agent.name} · {agent.role}
      </TooltipContent>
    </Tooltip>
  )
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Agent } from "@/lib/types"

export function AgentAvatar({ agent, className }: { agent: Agent; className?: string }) {
  return (
    <Avatar className={cn("size-6", className)}>
      <AvatarFallback
        className="text-[10px] font-semibold text-white"
        style={{ backgroundColor: agent.avatarColor }}
      >
        {initials(agent.name)}
      </AvatarFallback>
    </Avatar>
  )
}

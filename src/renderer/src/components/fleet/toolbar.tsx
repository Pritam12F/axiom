'use client'

import { Pause, Play, Search } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { Kbd } from '@renderer/components/ui/kbd'
import { useFleet } from '@renderer/lib/store'
import { KillSwitchDialog } from '@renderer/components/fleet/kill-switch-dialog'

function useTitle() {
  const { view, agents, groups } = useFleet()
  switch (view.name) {
    case 'overview':
      return { title: 'Overview', subtitle: 'Fleet status at a glance' }
    case 'agents':
      return { title: 'Agents', subtitle: 'Every agent and its machine' }
    case 'agent-detail': {
      const agent = agents.find((a) => a.id === view.agentId)
      return { title: agent?.name ?? 'Agent', subtitle: 'Agent detail' }
    }
    case 'projects':
      return { title: 'Projects', subtitle: 'Repositories and their assigned groups' }
    case 'groups': {
      const group = groups.find((g) => g.id === view.groupId)
      return { title: group ? group.name : 'Groups', subtitle: 'Members, project, and task board' }
    }
    case 'approvals':
      return { title: 'Approvals', subtitle: 'Requests waiting for human sign-off' }
    default:
      return { title: 'Fleet', subtitle: '' }
  }
}

export function Toolbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { title, subtitle } = useTitle()
  const { fleetPaused, pauseAll, resumeAll } = useFleet()

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-baseline gap-2 min-w-0">
        <h1 className="truncate text-[13px] font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onOpenPalette} className="text-muted-foreground">
          <Search data-icon="inline-start" />
          Search
          <Kbd className="ml-1.5">⌘K</Kbd>
        </Button>
        {fleetPaused ? (
          <Button variant="outline" size="sm" onClick={resumeAll}>
            <Play data-icon="inline-start" />
            Resume all
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={pauseAll}>
            <Pause data-icon="inline-start" />
            Pause all
          </Button>
        )}
        <KillSwitchDialog />
      </div>
    </header>
  )
}

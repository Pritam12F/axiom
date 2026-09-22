'use client'

import * as React from 'react'
import { useFleet } from '@renderer/lib/store'
import { AppSidebar } from '@renderer/components/fleet/sidebar'
import { Toolbar } from '@renderer/components/fleet/toolbar'
import { CommandPalette } from '@renderer/components/fleet/command-palette'
import { NewAgentSheet } from '@renderer/components/fleet/new-agent-sheet'
import { OverviewView } from '@renderer/components/fleet/views/overview-view'
import { AgentsView } from '@renderer/components/fleet/views/agents-view'
import { AgentDetailView } from '@renderer/components/fleet/views/agent-detail-view'
import { ProjectsView } from '@renderer/components/fleet/views/projects-view'
import { GroupsView } from '@renderer/components/fleet/views/groups-view'
import { ApprovalsView } from '@renderer/components/fleet/views/approvals-view'

export function AppShell() {
  const { view } = useFleet()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [newAgentOpen, setNewAgentOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Toolbar onOpenPalette={() => setPaletteOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          {view.name === 'overview' && <OverviewView />}
          {view.name === 'agents' && <AgentsView onNewAgent={() => setNewAgentOpen(true)} />}
          {view.name === 'agent-detail' && <AgentDetailView agentId={view.agentId} />}
          {view.name === 'projects' && <ProjectsView />}
          {view.name === 'groups' && <GroupsView groupId={view.groupId} />}
          {view.name === 'approvals' && <ApprovalsView />}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNewAgent={() => setNewAgentOpen(true)}
      />
      <NewAgentSheet open={newAgentOpen} onOpenChange={setNewAgentOpen} />
    </div>
  )
}

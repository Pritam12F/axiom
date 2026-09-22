'use client'

import * as React from 'react'
import { Bot, FolderKanban, LayoutDashboard, ShieldAlert, UserPlus, Users } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@renderer/components/ui/command'
import { useFleet } from '@renderer/lib/store'
import { StatusDot } from '@renderer/components/fleet/status-dot'

export function CommandPalette({
  open,
  onOpenChange,
  onNewAgent
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewAgent: () => void
}) {
  const { agents, projects, groups, setView, goToAgent } = useFleet()

  const run = React.useCallback(
    (fn: () => void) => {
      fn()
      onOpenChange(false)
    },
    [onOpenChange]
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Jump to anything in Fleet"
    >
      <Command>
        <CommandInput placeholder="Jump to an agent, project, group, or run an action..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(onNewAgent)}>
              <UserPlus />
              New agent
            </CommandItem>
            <CommandItem onSelect={() => run(() => setView({ name: 'overview' }))}>
              <LayoutDashboard />
              Go to Overview
            </CommandItem>
            <CommandItem onSelect={() => run(() => setView({ name: 'approvals' }))}>
              <ShieldAlert />
              Go to Approvals
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Agents">
            {agents.map((agent) => (
              <CommandItem
                key={agent.id}
                value={agent.name}
                onSelect={() => run(() => goToAgent(agent.id))}
              >
                <Bot />
                <span className="flex-1">{agent.name}</span>
                <StatusDot status={agent.status} />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={project.name}
                onSelect={() => run(() => setView({ name: 'projects' }))}
              >
                <FolderKanban />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Groups">
            {groups.map((group) => (
              <CommandItem
                key={group.id}
                value={group.name}
                onSelect={() => run(() => setView({ name: 'groups', groupId: group.id }))}
              >
                <Users />
                {group.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

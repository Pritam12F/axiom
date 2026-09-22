'use client'

import * as React from 'react'
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { GitBranch } from 'lucide-react'
import { useFleet } from '@renderer/lib/store'
import { ProjectTray } from '@renderer/components/fleet/groups/project-tray'
import { GroupTabs } from '@renderer/components/fleet/groups/group-tabs'
import { MemberChip } from '@renderer/components/fleet/groups/member-chip'
import { KanbanColumn } from '@renderer/components/fleet/groups/kanban-column'
import { TaskCard } from '@renderer/components/fleet/groups/task-card'
import type { TaskColumn } from '@renderer/lib/types'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from '@renderer/components/ui/empty'
import { Users } from 'lucide-react'

const COLUMNS: { key: TaskColumn; title: string }[] = [
  { key: 'planned', title: 'Planned' },
  { key: 'in-progress', title: 'In progress' },
  { key: 'in-review', title: 'In review' },
  { key: 'done', title: 'Done' }
]

export function GroupsView({ groupId }: { groupId?: string }) {
  const { groups, projects, agents, tasks, setView, assignProjectToGroup, moveTask } = useFleet()
  const [dragOverlay, setDragOverlay] = React.useState<{
    type: 'project' | 'task'
    id: string
  } | null>(null)

  const activeGroupId = groupId ?? groups[0]?.id

  if (!activeGroupId) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No groups yet</EmptyTitle>
          <EmptyDescription>
            Create a group to start assigning projects and agents.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? groups[0]
  const groupNameById = new Map(groups.map((g) => [g.id, g.name]))
  const members = agents.filter((a) => a.groupId === activeGroup.id)
  const assignedProject = projects.find((p) => p.id === activeGroup.projectId)
  const groupTasks = assignedProject ? tasks.filter((t) => t.projectId === assignedProject.id) : []

  function handleDragStart(e: DragStartEvent) {
    const id = String(e.active.id)
    if (id.startsWith('project-'))
      setDragOverlay({ type: 'project', id: id.replace('project-', '') })
    else if (id.startsWith('task-')) setDragOverlay({ type: 'task', id: id.replace('task-', '') })
  }

  function handleDragEnd(e: DragEndEvent) {
    setDragOverlay(null)
    const { active, over } = e
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId.startsWith('project-') && overId.startsWith('group-')) {
      assignProjectToGroup(activeId.replace('project-', ''), overId.replace('group-', ''))
    }
    if (activeId.startsWith('task-') && overId.startsWith('column-')) {
      moveTask(activeId.replace('task-', ''), overId.replace('column-', '') as TaskColumn)
    }
  }

  const draggedProject =
    dragOverlay?.type === 'project' ? projects.find((p) => p.id === dragOverlay.id) : null
  const draggedTask =
    dragOverlay?.type === 'task' ? tasks.find((t) => t.id === dragOverlay.id) : null

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 p-5">
        <ProjectTray projects={projects} groupNameById={groupNameById} />

        <GroupTabs
          groups={groups}
          activeId={activeGroup.id}
          onSelect={(id) => setView({ name: 'groups', groupId: id })}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {members.length === 0 && (
              <span className="text-xs text-muted-foreground">No members yet</span>
            )}
            {members.map((agent) => (
              <MemberChip key={agent.id} agent={agent} />
            ))}
          </div>
          {assignedProject ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GitBranch className="size-3.5" />
              {assignedProject.name}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">No project assigned</span>
          )}
        </div>

        {assignedProject ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.key}
                column={col.key}
                title={col.title}
                tasks={groupTasks.filter((t) => t.column === col.key)}
                agents={agents}
              />
            ))}
          </div>
        ) : (
          <Empty className="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GitBranch />
              </EmptyMedia>
              <EmptyTitle>No project assigned to {activeGroup.name}</EmptyTitle>
              <EmptyDescription>
                Drag a project from the tray above onto this group.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      <DragOverlay>
        {draggedProject && (
          <div className="flex items-center gap-2 rounded-full border border-primary bg-card py-1.5 pl-3 pr-3 shadow-lg">
            <span className="text-xs font-medium text-foreground">{draggedProject.name}</span>
          </div>
        )}
        {draggedTask && (
          <TaskCard
            task={draggedTask}
            agent={agents.find((a) => a.id === draggedTask.assigneeAgentId)}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

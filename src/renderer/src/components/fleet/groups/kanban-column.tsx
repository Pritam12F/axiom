'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@renderer/lib/utils'
import { TaskCard } from '@renderer/components/fleet/groups/task-card'
import type { Agent, Task, TaskColumn } from '@renderer/lib/types'

export function KanbanColumn({
  column,
  title,
  tasks,
  agents
}: {
  column: TaskColumn
  title: string
  tasks: Task[]
  agents: Agent[]
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column}`,
    data: { type: 'column', column }
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-40 flex-col gap-2 rounded-lg border border-transparent bg-muted/40 p-2.5 transition-colors duration-150',
        isOver && 'border-primary/50 bg-primary/5'
      )}
    >
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <span className="tabular text-[11px] text-muted-foreground">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            agent={agents.find((a) => a.id === task.assigneeAgentId)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-md border border-dashed border-border py-4 text-center text-[11px] text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GitBranch } from 'lucide-react'
import { Badge } from '@renderer/components/ui/badge'
import { AgentAvatar } from '@renderer/components/fleet/agent-avatar'
import type { Agent, Task } from '@renderer/lib/types'
import { cn } from '@renderer/lib/utils'

const PR_META: Record<Task['prStatus'], { label: string; className: string } | null> = {
  none: null,
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  open: { label: 'Open', className: 'bg-status-sleeping/15 text-status-sleeping' },
  review: { label: 'In review', className: 'bg-status-approval/15 text-status-approval' },
  merged: { label: 'Merged', className: 'bg-status-running/15 text-status-running' }
}

export function TaskCard({ task, agent }: { task: Task; agent: Agent | undefined }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { type: 'task', taskId: task.id }
  })

  const prMeta = task.prStatus !== 'none' ? PR_META[task.prStatus] : null

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left transition-colors duration-150 hover:border-primary/40',
        isDragging && 'z-10 opacity-50'
      )}
    >
      <p className="text-xs font-medium leading-snug text-foreground">{task.title}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {agent && <AgentAvatar agent={agent} />}
          {task.branch && (
            <span className="flex min-w-0 items-center gap-1 truncate font-mono text-[10.5px] text-muted-foreground">
              <GitBranch className="size-2.5 shrink-0" />
              <span className="truncate">{task.branch}</span>
            </span>
          )}
        </div>
        {prMeta && (
          <Badge className={cn('shrink-0 border-0 text-[10px]', prMeta.className)}>
            {prMeta.label}
            {task.prNumber ? ` #${task.prNumber}` : ''}
          </Badge>
        )}
      </div>
    </div>
  )
}

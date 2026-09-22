'use client'

import * as React from 'react'
import {
  ChevronRight,
  FileEdit,
  FlaskConical,
  GitCommit,
  MessageSquare,
  Sparkles,
  Terminal as TerminalIcon
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/ui/collapsible'
import type { AgentEvent, EventKind } from '@renderer/lib/types'
import { TimeAgo } from '@renderer/components/fleet/time-ago'
import { cn } from '@renderer/lib/utils'

const KIND_META: Record<EventKind, { icon: typeof Sparkles; label: string; className: string }> = {
  thought: { icon: Sparkles, label: 'Thinking', className: 'text-primary bg-primary/10' },
  shell: { icon: TerminalIcon, label: 'Shell', className: 'text-foreground bg-muted' },
  'file-edit': {
    icon: FileEdit,
    label: 'File edit',
    className: 'text-status-sleeping bg-status-sleeping/10'
  },
  git: { icon: GitCommit, label: 'Git', className: 'text-status-running bg-status-running/10' },
  test: {
    icon: FlaskConical,
    label: 'Test',
    className: 'text-status-approval bg-status-approval/10'
  },
  message: { icon: MessageSquare, label: 'Message', className: 'text-accent-foreground bg-accent' }
}

export function ActivityTab({ events }: { events: AgentEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
    )
  }

  return (
    <ol className="flex flex-col gap-0 p-4">
      {events.map((event, i) => {
        const meta = KIND_META[event.kind]
        return (
          <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < events.length - 1 && (
              <span className="absolute left-[15px] top-7 h-[calc(100%-20px)] w-px bg-border" />
            )}
            <div
              className={cn(
                'z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full',
                meta.className
              )}
            >
              <meta.icon className="size-3.5" />
            </div>
            <Collapsible className="min-w-0 flex-1">
              <CollapsibleTrigger className="group flex w-full items-start justify-between gap-2 text-left">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium leading-snug text-foreground">
                    {event.title}
                  </p>
                  <TimeAgo
                    iso={event.timestamp}
                    className="tabular block text-[11px] text-muted-foreground"
                  />
                </div>
                {event.detail && (
                  <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[panel-open]:rotate-90" />
                )}
              </CollapsibleTrigger>
              {event.detail && (
                <CollapsibleContent className="mt-1.5 rounded-md bg-muted/60 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-muted-foreground">
                  {event.detail}
                </CollapsibleContent>
              )}
            </Collapsible>
          </li>
        )
      })}
    </ol>
  )
}

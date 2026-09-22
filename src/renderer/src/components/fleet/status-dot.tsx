import { cn } from '@renderer/lib/utils'
import type { AgentStatus } from '@renderer/lib/types'

export const STATUS_META: Record<
  AgentStatus,
  { label: string; className: string; pulse?: boolean }
> = {
  running: { label: 'Running', className: 'bg-status-running', pulse: true },
  idle: { label: 'Idle', className: 'bg-status-idle' },
  sleeping: { label: 'Sleeping', className: 'bg-status-sleeping' },
  'needs-approval': { label: 'Needs approval', className: 'bg-status-approval', pulse: true },
  error: { label: 'Error', className: 'bg-status-error' }
}

export function StatusDot({ status, className }: { status: AgentStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <span className="relative inline-flex size-2" aria-hidden="true">
      <span
        className={cn(
          'absolute inset-0 rounded-full',
          meta.className,
          meta.pulse && 'status-pulse',
          className
        )}
      />
    </span>
  )
}

export function StatusLabel({
  status,
  showDot = true
}: {
  status: AgentStatus
  showDot?: boolean
}) {
  const meta = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
      {showDot && <StatusDot status={status} />}
      {meta.label}
    </span>
  )
}

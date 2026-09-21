import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accentClassName,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  accentClassName?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5">
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary", accentClassName)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="tabular text-lg font-semibold leading-tight text-foreground">{value}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

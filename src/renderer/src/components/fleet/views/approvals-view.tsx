"use client"

import { Check, ShieldAlert, X } from "lucide-react"
import { useFleet } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AgentAvatar } from "@/components/fleet/agent-avatar"
import { TimeAgo } from "@/components/fleet/time-ago"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { RiskLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

const RISK_META: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: "Low risk", className: "bg-status-running/15 text-status-running" },
  medium: { label: "Medium risk", className: "bg-status-approval/15 text-status-approval" },
  high: { label: "High risk", className: "bg-status-error/15 text-status-error" },
}

export function ApprovalsView() {
  const { approvals, agents, projects, approveRequest, denyRequest } = useFleet()
  const pending = approvals.filter((a) => a.status === "pending")
  const resolved = approvals.filter((a) => a.status !== "pending")

  if (approvals.length === 0) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldAlert />
          </EmptyMedia>
          <EmptyTitle>No approval requests</EmptyTitle>
          <EmptyDescription>Requests from agents that need human sign-off will show up here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">Pending</h2>
          <span className="tabular text-xs text-muted-foreground">{pending.length} waiting</span>
        </div>
        {pending.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
            Nothing waiting on you right now.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((req) => {
              const agent = agents.find((a) => a.id === req.agentId)
              const project = projects.find((p) => p.id === req.projectId)
              const risk = RISK_META[req.risk]
              return (
                <div key={req.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {agent && <AgentAvatar agent={agent} />}
                      <span className="text-[13px] font-medium text-foreground">{agent?.name ?? "agent"}</span>
                      <span className="text-xs text-muted-foreground">wants to run a command on</span>
                      <span className="text-xs font-medium text-foreground">{project?.name ?? "a project"}</span>
                    </div>
                    <Badge className={cn("border-0 text-[11px]", risk.className)}>{risk.label}</Badge>
                  </div>

                  <pre className="overflow-x-auto rounded-md bg-[oklch(0.14_0.006_285)] px-3 py-2.5 font-mono text-[12px] text-white/90">
                    {req.command}
                  </pre>

                  <p className="text-xs text-muted-foreground">{req.reason}</p>

                  <div className="flex items-center justify-between">
                    <TimeAgo iso={req.createdAt} className="tabular text-[11px] text-muted-foreground" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => denyRequest(req.id)}>
                        <X data-icon="inline-start" />
                        Deny
                      </Button>
                      <Button size="sm" onClick={() => approveRequest(req.id)}>
                        <Check data-icon="inline-start" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {resolved.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-[13px] font-semibold text-foreground">Resolved</h2>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {resolved.map((req) => {
              const agent = agents.find((a) => a.id === req.agentId)
              return (
                <div key={req.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    {agent && <AgentAvatar agent={agent} />}
                    <span className="truncate font-mono text-[11.5px] text-muted-foreground">{req.command}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0 text-[11px]",
                      req.status === "approved" ? "bg-status-running/15 text-status-running" : "bg-status-error/15 text-status-error",
                    )}
                  >
                    {req.status}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

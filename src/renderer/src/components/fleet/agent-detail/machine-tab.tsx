"use client"

import { Camera, Pause, Play, Square } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useFleet } from "@/lib/store"
import { formatCurrency } from "@/lib/format"
import type { Agent } from "@/lib/types"

function Gauge({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular font-medium text-foreground">{percent}%</span>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
  )
}

export function MachineTab({ agent }: { agent: Agent }) {
  const { pauseAgent, restartAgent, stopAgent, snapshotAgent } = useFleet()
  const cpuNow = agent.machine.cpuHistory[agent.machine.cpuHistory.length - 1]

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Gauge label="CPU" percent={cpuNow} />
        <Gauge label="Memory" percent={agent.machine.memoryPercent} />
        <Gauge label="Disk" percent={agent.machine.diskPercent} />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
        <InfoRow label="Region" value={agent.machine.region} />
        <InfoRow label="Base image" value={agent.machine.baseImage} mono />
        <InfoRow label="IP address" value={agent.machine.ip} mono />
        <InfoRow label="Machine size" value={`${agent.machine.vcpu} vCPU · ${agent.machine.memoryGb} GB`} />
        <InfoRow label="Disk" value={`${agent.machine.diskGb} GB`} />
        <InfoRow label="Cost" value={`${formatCurrency(agent.machine.costPerHour)}/hr`} />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Lifecycle</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => pauseAgent(agent.id)}>
            <Pause data-icon="inline-start" />
            Pause
          </Button>
          <Button size="sm" variant="outline" onClick={() => restartAgent(agent.id)}>
            <Play data-icon="inline-start" />
            Restart
          </Button>
          <Button size="sm" variant="outline" onClick={() => snapshotAgent(agent.id)}>
            <Camera data-icon="inline-start" />
            Snapshot
          </Button>
          <Button size="sm" variant="destructive" onClick={() => stopAgent(agent.id)}>
            <Square data-icon="inline-start" />
            Stop
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={mono ? "truncate font-mono text-[12px] text-foreground" : "truncate text-[13px] text-foreground"}>{value}</p>
    </div>
  )
}

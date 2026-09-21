"use client"

import * as React from "react"
import { MonitorSmartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function TerminalTab({ lines, agentName }: { lines: string[]; agentName: string }) {
  const [tookOver, setTookOver] = React.useState(false)

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Live session on {agentName}&apos;s machine</p>
        <Button
          size="sm"
          variant={tookOver ? "secondary" : "outline"}
          onClick={() => {
            setTookOver((v) => !v)
            toast(tookOver ? "Released control back to agent" : "You have taken over this terminal", {
              description: tookOver ? undefined : `${agentName} is paused while you drive the session.`,
            })
          }}
        >
          <MonitorSmartphone data-icon="inline-start" />
          {tookOver ? "Release control" : "Take over"}
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-[oklch(0.14_0.006_285)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] text-white/40">{agentName} — zsh</span>
        </div>
        <pre className="max-h-96 overflow-y-auto p-3.5 font-mono text-[12px] leading-relaxed text-white/85">
          {lines.map((line, i) => (
            <div key={i} className={line.startsWith("$") ? "text-[#7dd3fc]" : line.includes("error") || line.includes("failing") || line.includes("✗") ? "text-[#fda4af]" : line.includes("✓") || line.includes("passing") ? "text-[#86efac]" : ""}>
              {line || "\u00A0"}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

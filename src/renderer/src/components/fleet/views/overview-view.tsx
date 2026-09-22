'use client'

import { Bot, ListChecks, ShieldAlert, Wallet } from 'lucide-react'
import { useFleet } from '@renderer/lib/store'
import { StatCard } from '@renderer/components/fleet/stat-card'
import { AgentCard } from '@renderer/components/fleet/agent-card'
import { ActivityFeed } from '@renderer/components/fleet/activity-feed'
import { formatCurrency } from '@renderer/lib/format'

export function OverviewView() {
  const { agents, tasks, pendingApprovalCount, spendToday, dailyBudget } = useFleet()

  const runningCount = agents.filter((a) => a.status === 'running').length
  const inProgressTasks = tasks.filter((t) => t.column === 'in-progress').length

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Agents running" value={`${runningCount} / ${agents.length}`} icon={Bot} />
        <StatCard label="Tasks in progress" value={String(inProgressTasks)} icon={ListChecks} />
        <StatCard
          label="Awaiting approval"
          value={String(pendingApprovalCount)}
          icon={ShieldAlert}
          accentClassName={
            pendingApprovalCount > 0 ? 'bg-status-approval/15 text-status-approval' : undefined
          }
        />
        <StatCard
          label="Spend today"
          value={formatCurrency(spendToday)}
          hint={`of ${formatCurrency(dailyBudget)} daily budget`}
          icon={Wallet}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground">Fleet</h2>
            <span className="tabular text-xs text-muted-foreground">{agents.length} agents</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        <ActivityFeed />
      </div>
    </div>
  )
}

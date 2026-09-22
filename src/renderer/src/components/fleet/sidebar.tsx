'use client'

import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  Users,
  ShieldAlert,
  Settings,
  Circle,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { useFleet } from '@renderer/lib/store'
import { useTheme } from '@renderer/lib/theme'
import { Badge } from '@renderer/components/ui/badge'
import { Progress } from '@renderer/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { TrafficLights } from '@renderer/components/fleet/traffic-lights'
import { formatCurrency } from '@renderer/lib/format'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'agents', label: 'Agents', icon: Bot },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'groups', label: 'Groups', icon: Users },
  { key: 'approvals', label: 'Approvals', icon: ShieldAlert }
] as const

export function AppSidebar() {
  const { view, setView, groups, pendingApprovalCount, spendToday, dailyBudget } = useFleet()
  const { theme, setTheme } = useTheme()

  const activeKey = view.name === 'agent-detail' ? 'agents' : view.name

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/80">
      <div className="flex h-11 items-center px-3">
        <TrafficLights />
      </div>

      <div className="flex items-center gap-2 px-4 pb-4 pt-1">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Bot className="size-3.5" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Fleet</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key
          return (
            <button
              key={item.key}
              onClick={() => setView({ name: item.key } as never)}
              className={cn(
                'group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors duration-150',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.key === 'approvals' && pendingApprovalCount > 0 && (
                <Badge className="h-5 min-w-5 justify-center bg-status-approval px-1 text-[11px] text-white">
                  {pendingApprovalCount}
                </Badge>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-5 px-4">
        <p className="px-0.5 text-[11px] font-medium uppercase tracking-wide text-sidebar-foreground/45">
          Groups
        </p>
      </div>
      <div className="flex flex-col gap-0.5 px-2 pt-1">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setView({ name: 'groups', groupId: g.id })}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors duration-150',
              view.name === 'groups' && view.groupId === g.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
            )}
          >
            <Circle className="size-2.5 shrink-0 fill-current" style={{ color: g.color }} />
            <span className="flex-1 truncate">{g.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between text-[11px] text-sidebar-foreground/55">
          <span>Spend today</span>
          <span className="tabular">
            {formatCurrency(spendToday)} / {formatCurrency(dailyBudget)}
          </span>
        </div>
        <Progress value={(spendToday / dailyBudget) * 100} className="mt-1.5 h-1" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-2.5 border-t border-sidebar-border px-4 py-2.5 text-left text-sidebar-foreground/80 transition-colors duration-150 hover:bg-sidebar-accent/60" />
          }
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-[10px] font-semibold text-sidebar-accent-foreground">
            JD
          </div>
          <span className="flex-1 truncate text-[13px]">Jordan Diaz</span>
          <Settings className="size-3.5 text-sidebar-foreground/50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun />
              Light
              {theme === 'light' && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  On
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon />
              Dark
              {theme === 'dark' && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  On
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor />
              System
              {theme === 'system' && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  On
                </Badge>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}

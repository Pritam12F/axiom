'use client'

import { GitBranch } from 'lucide-react'
import { useFleet } from '@renderer/lib/store'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@renderer/components/ui/card'
import { Progress } from '@renderer/components/ui/progress'
import type { Project } from '@renderer/lib/types'

export function ProjectCard({ project }: { project: Project }) {
  const { groups, tasks } = useFleet()
  const group = groups.find((g) => g.id === project.groupId)
  const projectTasks = tasks.filter((t) => t.projectId === project.id)

  const counts = {
    planned: projectTasks.filter((t) => t.column === 'planned').length,
    'in-progress': projectTasks.filter((t) => t.column === 'in-progress').length,
    'in-review': projectTasks.filter((t) => t.column === 'in-review').length,
    done: projectTasks.filter((t) => t.column === 'done').length
  }
  const total = projectTasks.length || 1
  const progress = (counts.done / total) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[13px]">{project.name}</CardTitle>
          {group && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: group.color }} />
              {group.name}
            </span>
          )}
        </div>
        <CardDescription className="flex items-center gap-1.5 font-mono text-[11px]">
          <GitBranch className="size-3" />
          {project.repo}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Progress</span>
            <span className="tabular">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <TaskCount label="Planned" value={counts.planned} />
          <TaskCount label="In progress" value={counts['in-progress']} />
          <TaskCount label="Review" value={counts['in-review']} />
          <TaskCount label="Done" value={counts.done} />
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-[11px] text-muted-foreground">
          Branch <span className="font-mono text-foreground">{project.defaultBranch}</span> · Active{' '}
          {project.lastActivity}
        </span>
      </CardFooter>
    </Card>
  )
}

function TaskCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/60 px-1.5 py-1.5">
      <p className="tabular text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[10px] leading-tight text-muted-foreground">{label}</p>
    </div>
  )
}

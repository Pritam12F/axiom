'use client'

import { useFleet } from '@renderer/lib/store'
import { ProjectCard } from '@renderer/components/fleet/project-card'
import { NewProjectDialog } from '@renderer/components/fleet/new-project-dialog'

export function ProjectsView() {
  const { projects } = useFleet()

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="tabular text-xs text-muted-foreground">{projects.length} projects</span>
        <NewProjectDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

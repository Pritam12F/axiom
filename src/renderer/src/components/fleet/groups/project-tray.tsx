"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/types"

function DraggableProjectChip({ project, groupName }: { project: Project; groupName: string | undefined }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `project-${project.id}`,
    data: { type: "project", projectId: project.id },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "flex shrink-0 cursor-grab items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-2 pr-3 active:cursor-grabbing",
        isDragging && "z-20 opacity-50",
      )}
    >
      <GripVertical className="size-3.5 text-muted-foreground" />
      <span className="text-xs font-medium text-foreground">{project.name}</span>
      <span className="text-[11px] text-muted-foreground">{groupName ?? "Unassigned"}</span>
    </div>
  )
}

export function ProjectTray({ projects, groupNameById }: { projects: Project[]; groupNameById: Map<string, string> }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 p-3">
      <p className="text-[11px] font-medium text-muted-foreground">Drag a project onto a group to assign it</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {projects.map((project) => (
          <DraggableProjectChip key={project.id} project={project} groupName={project.groupId ? groupNameById.get(project.groupId) : undefined} />
        ))}
      </div>
    </div>
  )
}

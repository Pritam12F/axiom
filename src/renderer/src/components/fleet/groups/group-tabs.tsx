"use client"

import { useDroppable } from "@dnd-kit/core"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Group } from "@/lib/types"

function GroupTab({ group, active, onClick }: { group: Group; active: boolean; onClick: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `group-${group.id}`, data: { type: "group", groupId: group.id } })

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
        active ? "border-border bg-accent text-accent-foreground" : "border-transparent text-muted-foreground hover:bg-accent/50",
        isOver && "border-primary/60 bg-primary/10 text-foreground",
      )}
    >
      <Circle className="size-2.5 fill-current" style={{ color: group.color }} />
      {group.name}
    </button>
  )
}

export function GroupTabs({ groups, activeId, onSelect }: { groups: Group[]; activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {groups.map((g) => (
        <GroupTab key={g.id} group={g} active={g.id === activeId} onClick={() => onSelect(g.id)} />
      ))}
    </div>
  )
}

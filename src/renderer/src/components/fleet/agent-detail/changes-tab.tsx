import { FileCode } from 'lucide-react'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from '@renderer/components/ui/empty'

function DiffLine({ line }: { line: string }) {
  if (line.startsWith('@@')) {
    return <div className="bg-muted/70 px-3 py-0.5 text-muted-foreground">{line}</div>
  }
  if (line.startsWith('+')) {
    return <div className="bg-status-running/10 px-3 py-0.5 text-status-running">{line}</div>
  }
  if (line.startsWith('-')) {
    return <div className="bg-status-error/10 px-3 py-0.5 text-status-error">{line}</div>
  }
  return <div className="px-3 py-0.5 text-foreground">{line || '\u00A0'}</div>
}

export function ChangesTab({ diffs }: { diffs: { file: string; hunks: string[] }[] }) {
  if (diffs.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileCode />
          </EmptyMedia>
          <EmptyTitle>No changes yet</EmptyTitle>
          <EmptyDescription>Edits made by this agent will show up here as a diff.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {diffs.map((diff) => (
        <div key={diff.file} className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-1.5">
            <FileCode className="size-3.5 text-muted-foreground" />
            <span className="font-mono text-[12px] text-foreground">{diff.file}</span>
          </div>
          <div className="font-mono text-[12px] leading-relaxed">
            {diff.hunks.map((hunk, i) => (
              <div key={i}>
                {hunk.split('\n').map((line, j) => (
                  <DiffLine key={j} line={line} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'

import * as React from 'react'
import { formatTimeAgo } from '@renderer/lib/format'

// Renders nothing on the server and during the initial client render so the
// hydrated markup matches exactly, then fills in the relative time on mount.
// Computing this directly during render would use Date.now(), which differs
// between the server render and client hydration and triggers a mismatch.
export function TimeAgo({ iso, className }: { iso: string; className?: string }) {
  const [label, setLabel] = React.useState('')

  React.useEffect(() => {
    setLabel(formatTimeAgo(iso))
    const interval = setInterval(() => setLabel(formatTimeAgo(iso)), 30_000)
    return () => clearInterval(interval)
  }, [iso])

  return <span className={className}>{label}</span>
}

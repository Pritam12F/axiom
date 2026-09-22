'use client'

import { Power } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { Button } from '@renderer/components/ui/button'
import { useFleet } from '@renderer/lib/store'

export function KillSwitchDialog() {
  const { killSwitch } = useFleet()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Power data-icon="inline-start" />
        Kill switch
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Stop every agent machine?</AlertDialogTitle>
          <AlertDialogDescription>
            This immediately powers down all agent machines across every project and group.
            In-progress work will be interrupted and unsaved session state may be lost. This cannot
            be undone from here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction render={<Button variant="destructive" onClick={killSwitch} />}>
            Stop all machines
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

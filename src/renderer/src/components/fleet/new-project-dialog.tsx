'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@renderer/components/ui/field'
import { Input } from '@renderer/components/ui/input'
import { Textarea } from '@renderer/components/ui/textarea'
import { useFleet } from '@renderer/lib/store'

export function NewProjectDialog() {
  const { addProject } = useFleet()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [repo, setRepo] = React.useState('')
  const [branch, setBranch] = React.useState('main')
  const [description, setDescription] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !repo.trim()) return
    addProject({
      name: name.trim(),
      repo: repo.trim(),
      defaultBranch: branch.trim() || 'main',
      description
    })
    setName('')
    setRepo('')
    setBranch('main')
    setDescription('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" />
        New project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Add a repository so a group of agents can start working on it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="project-name">Name</FieldLabel>
              <Input
                id="project-name"
                placeholder="e.g. billing-service"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-repo">Repository</FieldLabel>
              <Input
                id="project-repo"
                placeholder="github.com/acme/billing-service"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-branch">Default branch</FieldLabel>
              <Input
                id="project-branch"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-description">Description</FieldLabel>
              <Textarea
                id="project-description"
                placeholder="What is this project for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={!name.trim() || !repo.trim()}>
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

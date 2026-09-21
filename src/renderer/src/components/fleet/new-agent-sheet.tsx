"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFleet } from "@/lib/store"
import type { MachineSize } from "@/lib/types"
import { formatCurrency } from "@/lib/format"

const SIZE_SPECS: Record<MachineSize, { label: string; vcpu: number; memoryGb: number; costPerHour: number }> = {
  small: { label: "Small", vcpu: 2, memoryGb: 4, costPerHour: 0.11 },
  medium: { label: "Medium", vcpu: 4, memoryGb: 8, costPerHour: 0.21 },
  large: { label: "Large", vcpu: 8, memoryGb: 16, costPerHour: 0.42 },
}

const REGIONS = ["us-east", "us-west", "eu-west", "ap-southeast"]
const BASE_IMAGES = ["ubuntu-24.04-node20", "ubuntu-24.04-python3.12", "ubuntu-24.04-go1.22"]

export function NewAgentSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { groups, addAgent } = useFleet()
  const [name, setName] = React.useState("")
  const [groupId, setGroupId] = React.useState(groups[0]?.id ?? "")
  const [size, setSize] = React.useState<MachineSize>("medium")
  const [region, setRegion] = React.useState(REGIONS[0])
  const [baseImage, setBaseImage] = React.useState(BASE_IMAGES[0])

  const spec = SIZE_SPECS[size]
  const monthlyCost = spec.costPerHour * 24 * 30

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !groupId) return
    addAgent({ name: name.trim(), groupId, size, region, baseImage })
    setName("")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New agent</SheetTitle>
          <SheetDescription>Provision a dedicated cloud machine for a new agent.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between overflow-y-auto">
          <div className="px-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="agent-name">Name</FieldLabel>
                <Input
                  id="agent-name"
                  placeholder="e.g. phoenix"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="agent-group">Group</FieldLabel>
                <Select value={groupId} onValueChange={(v) => v && setGroupId(v)}>
                  <SelectTrigger id="agent-group">
                    <SelectValue placeholder="Select a group">{(v: string) => groups.find((g) => g.id === v)?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Machine size</FieldLabel>
                <ToggleGroup
                  value={[size]}
                  onValueChange={(v) => v[0] && setSize(v[0] as MachineSize)}
                  spacing={2}
                  className="w-full"
                >
                  {(Object.keys(SIZE_SPECS) as MachineSize[]).map((key) => (
                    <ToggleGroupItem key={key} value={key} className="flex-1 flex-col gap-0.5 py-2">
                      <span className="text-xs font-medium">{SIZE_SPECS[key].label}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {SIZE_SPECS[key].vcpu} vCPU · {SIZE_SPECS[key].memoryGb} GB
                      </span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldDescription>Determines vCPU, memory, and hourly cost.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="agent-region">Region</FieldLabel>
                <Select value={region} onValueChange={(v) => v && setRegion(v)}>
                  <SelectTrigger id="agent-region">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="agent-image">Base image</FieldLabel>
                <Select value={baseImage} onValueChange={(v) => v && setBaseImage(v)}>
                  <SelectTrigger id="agent-image">
                    <SelectValue placeholder="Select a base image" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {BASE_IMAGES.map((img) => (
                        <SelectItem key={img} value={img}>
                          {img}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <div className="mt-5 flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2.5">
              <span className="text-xs text-muted-foreground">Estimated cost</span>
              <span className="tabular text-sm font-semibold">
                {formatCurrency(spec.costPerHour)}/hr · ~{formatCurrency(monthlyCost)}/mo
              </span>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={!name.trim()}>
              Create agent
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

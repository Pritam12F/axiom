import { Agent, Prisma, Project } from '@prisma/client'

export type OnboardResponseType = {
  projects: Project
  agents: Pick<Agent, 'id'>[]
  tables: Prisma.BatchPayload
}

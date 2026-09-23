import { errorDecoder } from '@main/lib/error-decoder'
import { prisma } from '@main/lib/prisma'
import { getSession } from '@main/lib/session'
import { FirstProjectSchemaType } from '@main/schemas/user'
import { IPCActionResponse } from '@main/types/action'
import { OnboardResponseType } from '@main/types/project'

export async function onboardUser(
  data: FirstProjectSchemaType
): Promise<IPCActionResponse<OnboardResponseType>> {
  const session = await getSession()

  if (!session || !session.user.id) {
    return {
      success: false,
      error: 'User not authorized'
    }
  }

  try {
    const promises = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: data.name ?? 'Random Name Proj',
          userId: session.user.id,
          description: data.description,
          initialInstructions: data.initialInstructions,
          resources: {
            create: data.resources.map((r) => ({
              source: r.name,
              url: r.url,
              userId: session.user.id
            }))
          },
          projectUrl: data.projectUrl
        }
      })

      const agents = await tx.agent.createManyAndReturn({
        data: data.agents.map((a) => ({
          name: a.name,
          userId: a.userId,
          models: a.models.map((m) => ({
            modelId: m.modelId,
            effort: m.effort
          })),
          projectId: project.id
        })),
        select: {
          id: true
        }
      })

      const tables = await tx.projectOnAgents.createMany({
        data: agents.map((a) => ({
          agentId: a.id,
          projectId: project.id
        }))
      })

      return {
        project,
        agents,
        tables
      }
    })

    return {
      success: true,
      data: {
        projects: promises.project,
        agents: promises.agents,
        tables: promises.tables
      }
    }
  } catch (err) {
    console.error(errorDecoder(err))
    return {
      success: false
    }
  }
}

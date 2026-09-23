import z from 'zod'

export const FirstAgentSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Too short of an agent name' })
    .max(40, { message: "Agent name can't be longer than 40 characters" }),
  userId: z.cuid2().nonoptional(),
  models: z
    .array(
      z.object({
        modelId: z.string().nonempty(),
        effort: z.string().nonempty()
      })
    )
    .min(1, { message: 'At least 1 model needed' })
})

export const FirstProjectSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Too short of an agent name' })
    .max(40, { message: "Agent name can't be longer than 40 characters" }),
  userId: z.cuid2().nonoptional(),
  description: z.string().nonempty(),
  initialInstructions: z.string().nonempty(),
  instructions: z.array(z.string().nonempty()).optional(),
  resources: z.array(
    z.object({
      name: z.string().nullable(),
      url: z.url().nonempty()
    })
  ),
  projectUrl: z.url().refine((val) => val.startsWith('https://github.com/'), {
    message: 'Not a valid github repo'
  }),
  agents: z.array(FirstAgentSchema).nonempty()
})

export type FirstAgentSchemaType = z.infer<typeof FirstAgentSchema>
export type FirstProjectSchemaType = z.infer<typeof FirstProjectSchema>

import z from 'zod'

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const SignUpEmailSchema = z.object({
  name: z.string().min(5, { message: 'Too short of a name' }),
  email: z.email().nonoptional(),
  password: z
    .string()
    .min(8, { message: 'Too short of a name' })
    .max(100, { message: 'Max characters 100' })
    .refine((value) => strongPasswordRegex.test(value), {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    })
})

export const SignInEmailSchema = z.object({
  email: z.email().nonoptional(),
  password: z
    .string()
    .min(8, { message: 'Too short of a name' })
    .max(100, { message: 'Max characters 100' })
})

export const SignInSocial = z.object({
  provider: z.string().min(1, { message: 'Provider is invalid' })
})

export type SignUpEmailType = z.infer<typeof SignUpEmailSchema>
export type SignInEmailType = z.infer<typeof SignInEmailSchema>
export type SignInSocialType = z.infer<typeof SignInSocial>

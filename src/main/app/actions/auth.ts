import { authClient } from '@main/lib/auth-client'
import { auth } from '../../lib/auth'
import { prisma } from '../../lib/prisma'
import { SignInEmailType, SignInSocialType, SignUpEmailType } from '@main/schemas/auth'

export async function handleUserSignup({
  email,
  name,
  password,
  displayUsername
}: SignUpEmailType & {
  displayUsername?: string
}) {
  try {
    const data = await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        callbackURL: 'axiom://'
      }
    })

    if (data.user) {
      if (displayUsername) {
        await prisma.user.update({
          where: {
            id: data.user.id
          },
          data: {
            username: displayUsername
          }
        })
      }

      return {
        success: true,
        message: 'Signed up user'
      }
    }
  } catch {
    console.error(new Error('Could not sign up user'))
  }
}

export async function handleUserSigninEmail({ email, password }: SignInEmailType) {
  try {
    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: 'axiom://'
      }
    })

    if (data.user) {
      return {
        success: true,
        message: 'Signed up user'
      }
    }
  } catch {
    console.error(new Error('Could not sign in user'))
  }
}

export async function handleSocialSignin({ provider }: SignInSocialType) {
  try {
    const { data, error } = await authClient.signIn.social({
      provider
    })

    if (error) {
      return {
        success: false,
        error
      }
    }

    return {
      success: true,
      redirect: data.redirect,
      url: data.url
    }
  } catch {
    console.error(`Error signing in user with ${provider}`)

    return {
      success: false,
      error: `Error signing in user with ${provider}`
    }
  }
}

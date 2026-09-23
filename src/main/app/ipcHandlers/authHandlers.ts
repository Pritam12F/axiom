import { ipcMain } from 'electron/main'
import { handleSocialSignin, handleUserSigninEmail, handleUserSignup } from '../actions/auth'
import {
  SignInEmailType,
  SignUpEmailSchema,
  SignUpEmailType,
  SignInEmailSchema,
  SignInSocial
} from '@main/schemas/auth'
import { checkValidUrl } from '@main/lib/url-checker'

ipcMain.handle(
  'signup-email',
  async (
    event,
    data: SignUpEmailType & {
      displayUsername?: string
    }
  ) => {
    const content = event.sender

    const senderUrl = content.getURL()

    const valid = checkValidUrl(senderUrl)

    if (!valid) {
      return {
        success: false,
        message: 'Invalid client url'
      }
    }

    const { success, data: userData } = SignUpEmailSchema.safeParse(data)

    if (!success) {
      return {
        success: false
      }
    }

    const authObj = await handleUserSignup({ ...userData })

    if (authObj && authObj.success) {
      return {
        success: authObj.success
      }
    }

    return {
      success: false
    }
  }
)

ipcMain.handle('signin-email', async (event, data: SignInEmailType) => {
  const content = event.sender

  const senderUrl = content.getURL()

  const valid = checkValidUrl(senderUrl)

  if (!valid) {
    return {
      success: false,
      message: 'Invalid client url'
    }
  }

  const { success, data: userData } = SignInEmailSchema.safeParse(data)

  if (!success) {
    return {
      success: false
    }
  }

  const authObj = await handleUserSigninEmail({ ...userData })

  if (authObj && authObj.success) {
    return {
      success: authObj.success
    }
  }

  return {
    success: false
  }
})

ipcMain.handle('social_login', async (event, data) => {
  const content = event.sender

  const senderUrl = content.getURL()

  const valid = checkValidUrl(senderUrl)

  if (!valid) {
    return {
      success: false,
      message: 'Invalid client url'
    }
  }

  const { success, data: userData, error } = SignInSocial.safeParse(data)

  if (!success) {
    return {
      success: false,
      error: error.message
    }
  }

  try {
    const { success, redirect, url } = await handleSocialSignin({ ...userData })

    if (success) {
    }
    return {
      success,
      redirect,
      url
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'

    console.error(errorMessage)
    return {
      success: false,
      error: errorMessage
    }
  }
})

import { app } from 'electron/main'

export function checkValidUrl(url: string) {
  const isPacked = app.isPackaged

  if (isPacked) {
    if (!url.startsWith('app://') || !url.startsWith('file://')) {
      console.error(`Blocked IPC request from source: ${url}`)
      return false
    }

    return true
  }

  if (!url.startsWith('http://localhost') || !url.startsWith('http://127.0.0.1')) {
    return false
  }

  return true
}

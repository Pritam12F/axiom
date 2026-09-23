import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron/renderer'
import { SignInEmailType, SignUpEmailType } from '@main/schemas/auth'
// Custom APIs for renderer
const api = {
  signUpEmail: (data: SignUpEmailType) => ipcRenderer.invoke('signup-email', data),
  signInEmail: (data: SignInEmailType) => ipcRenderer.invoke('signin-email', data)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

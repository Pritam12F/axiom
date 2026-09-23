import { handleUserSignup } from './app/actions/auth'
import { createWindow } from './app/main-window'
import { app, BrowserWindow, ipcMain } from 'electron'

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

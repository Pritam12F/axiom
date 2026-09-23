import {
  app,
  BrowserWindow,
  Menu,
  nativeTheme,
  shell,
  type MenuItemConstructorOptions
} from 'electron'
import { is } from '@electron-toolkit/utils'
// import { MENU_ACTION_CHANNEL, type MenuAction } from "share"

const isMac = process.platform === 'darwin'

const DOCS_URL = 'https://example.com/docs'
const ISSUES_URL = 'https://example.com/issues'

interface MenuState {
  pendingApprovals: number
  runningAgents: number
}

let getWindow: () => BrowserWindow
let state: MenuState = { pendingApprovals: 0, runningAgents: 0 }

/** Call once from index.ts after app is ready. */
export function setupMenu(getOrCreateMainWindow: () => BrowserWindow): void {
  getWindow = getOrCreateMainWindow
  render()
}

/** Call from sync.ts whenever approvals or running agents change. */
export function updateMenuState(next: Partial<MenuState>): void {
  state = { ...state, ...next }
  render()
}

function send(action: MenuAction): void {
  const win = getWindow()
  if (win.isMinimized()) win.restore()
  win.show()
  win.focus()
  // If the window was just recreated, wait for the renderer to load.
  if (win.webContents.isLoading()) {
    win.webContents.once('did-finish-load', () => win.webContents.send(MENU_ACTION_CHANNEL, action))
  } else {
    win.webContents.send(MENU_ACTION_CHANNEL, action)
  }
}

function item(label: string, action: MenuAction, accelerator?: string): MenuItemConstructorOptions {
  return { label, accelerator, click: () => send(action) }
}

function themeItem(
  label: string,
  source: typeof nativeTheme.themeSource
): MenuItemConstructorOptions {
  return {
    label,
    type: 'radio',
    checked: nativeTheme.themeSource === source,
    click: () => {
      nativeTheme.themeSource = source
    }
  }
}

function render(): void {
  const { pendingApprovals, runningAgents } = state
  const settings = item('Settings…', 'open-settings', 'CmdOrCtrl+,')

  const template: MenuItemConstructorOptions[] = [
    // App menu (macOS only)
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              settings,
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          } satisfies MenuItemConstructorOptions
        ]
      : []),

    {
      label: 'File',
      submenu: [
        item('New Agent…', 'new-agent', 'CmdOrCtrl+N'),
        item('New Project…', 'new-project', 'Shift+CmdOrCtrl+N'),
        item('New Group…', 'new-group', 'Alt+CmdOrCtrl+N'),
        { type: 'separator' },
        ...(isMac
          ? [{ role: 'close' } satisfies MenuItemConstructorOptions]
          : [settings, { type: 'separator' } as const, { role: 'quit' } as const])
      ]
    },

    // Roles here are what make Cmd+C / Cmd+V / Cmd+A work in text fields on macOS.
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        item('Find…', 'find', 'CmdOrCtrl+F')
      ]
    },

    {
      label: 'View',
      submenu: [
        item('Command Palette…', 'command-palette', 'CmdOrCtrl+K'),
        item('Toggle Sidebar', 'toggle-sidebar', isMac ? 'Control+Command+S' : 'Ctrl+B'),
        { type: 'separator' },
        {
          label: 'Appearance',
          submenu: [
            themeItem('System', 'system'),
            themeItem('Light', 'light'),
            themeItem('Dark', 'dark')
          ]
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(is.dev
          ? [
              { type: 'separator' } as const,
              { role: 'reload' } as const,
              { role: 'forceReload' } as const,
              { role: 'toggleDevTools' } as const
            ]
          : [])
      ]
    },

    {
      label: 'Go',
      submenu: [
        item('Overview', 'go:overview', 'CmdOrCtrl+1'),
        item('Agents', 'go:agents', 'CmdOrCtrl+2'),
        item('Projects', 'go:projects', 'CmdOrCtrl+3'),
        item('Groups', 'go:groups', 'CmdOrCtrl+4'),
        item(
          pendingApprovals > 0 ? `Approvals (${pendingApprovals})` : 'Approvals',
          'go:approvals',
          'CmdOrCtrl+5'
        )
      ]
    },

    // Fleet-wide actions deliberately have no keyboard shortcuts.
    {
      label: 'Fleet',
      submenu: [
        { ...item('Pause All Agents', 'fleet:pause-all'), enabled: runningAgents > 0 },
        item('Resume All Agents', 'fleet:resume-all'),
        { type: 'separator' },
        item('Kill Switch…', 'fleet:kill-switch')
      ]
    },

    { role: 'windowMenu' },

    {
      role: 'help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal(DOCS_URL) },
        { label: 'Report an Issue…', click: () => shell.openExternal(ISSUES_URL) },
        { type: 'separator' },
        { label: 'Show Logs', click: () => shell.openPath(app.getPath('logs')) }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

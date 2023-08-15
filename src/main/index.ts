import { app, shell, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { createReadStream } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import localshortcut from 'electron-localshortcut'
import settings from 'electron-settings'
import JSONStream from 'JSONStream'
import './express-server'

app.commandLine.appendSwitch('ignore-gpu-blacklist')

interface WindowStateCache {
  x?: number
  y?: number
  width: number
  height: number
  devtools?: boolean
}

async function createWindow() {
  let windowState: WindowStateCache = { width: 900, height: 670 }
  const hasCachedDimensions = await settings.has('window')

  if (hasCachedDimensions) {
    const cached = (await settings.get(['window'])) as object
    windowState = { ...windowState, ...cached }
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: '#000000',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (windowState.devtools) mainWindow.webContents.openDevTools()
  })

  async function cacheWindowState() {
    const bounds = mainWindow.getBounds()
    const devtools = mainWindow.webContents.isDevToolsOpened()

    await settings.set('window', { ...bounds, devtools })
    console.log('cached window state updated')
  }

  mainWindow.on('resized', () => cacheWindowState())
  mainWindow.on('moved', () => cacheWindowState())
  mainWindow.webContents.on('devtools-opened', () => cacheWindowState())
  mainWindow.webContents.on('devtools-closed', () => cacheWindowState())

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  localshortcut.register(mainWindow, 'Ctrl+Shift+S', () => {
    mainWindow.webContents.send('save-current-view')
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const getwindow = () => {
  try {
    const [win] = BrowserWindow.getAllWindows()
    return win
  } catch (err) {
    return undefined
  }
}

const minimize = () => {
  const win = getwindow()
  if (win) win.minimize()
}

const maximize = () => {
  const win = getwindow()
  if (win && win.isMaximized()) win.unmaximize()
  else if (win && !win.isMaximized()) win.maximize()
}

const restore = () => {
  const win = getwindow()
  if (win) win.restore()
}

const quit = () => {
  app.quit()
}

function toMenuItem(item) {
  const { callback, ...options } = item

  if (options.submenu) {
    options.submenu = options.submenu.map((submenu) => toMenuItem(submenu))
  }

  const win = getwindow()
  options.click = () => {
    console.log(`sending ${callback.event} back to renderer`)
    win?.webContents.send(callback.event, callback.payload)
  }

  const menuitem = options
  return menuitem
}

const context = (_, { menu, options }) => {
  const win = getwindow()
  const items = menu.map(toMenuItem)
  const m = Menu.buildFromTemplate(items)

  if (options?.x >= 0) options.x = ~~options.x
  if (options?.y >= 0) options.y = ~~options.y

  m.popup({ window: win, ...options })
}

async function set(_, { key, value }) {
  await settings.set(key, value)
  console.log(`cached new value for key: ${key}`)
}

async function get(_, key: string) {
  return await settings.get(key)
}

async function parse(_, paths: string[]) {
  // filter out file extensions that we don't support
  const validPaths = paths.filter((path) => /\.(json|czml)$/.test(path))
  if (!validPaths) return

  const win = getwindow()
  win?.webContents.send('set-progress-total', validPaths.length)

  for (let i = 0; i < validPaths.length; i++) {
    try {
      const packets: unknown[] = []
      const filePath = validPaths[i]
      const stream = createReadStream(filePath).pipe(JSONStream.parse('*'))

      // TODO Probably need some kind of timeout that will close the stream if it doesn't automatically
      // close after a certain amount of time. In that case, it would be safe to assume that something failed.

      stream.on('data', (data) => {
        if (data.czml) {
          packets.push(...data.czml)
        } else packets.push(data)
      })

      stream.on('close', () => {
        console.log(`finished parsing ${filePath}`)
        win?.webContents.send('load', packets)
      })
    } catch {}
  }
}

ipcMain.handle('minimize', minimize)
ipcMain.handle('maximize', maximize)
ipcMain.handle('restore', restore)
ipcMain.handle('exit', quit)
ipcMain.handle('context', context)
ipcMain.handle('set', set)
ipcMain.handle('get', get)
ipcMain.handle('parse', parse)

ipcMain.handle('dialogs:open', async (_, options = {}) => {
  const win = getwindow()!

  const defaults = {
    properties: ['multiSelections'],
    filters: [{ name: 'CZML', extensions: ['czml'] }]
  }

  const config = { ...defaults, ...options }

  const files = await dialog.showOpenDialog(win, config)
  return files.filePaths
})

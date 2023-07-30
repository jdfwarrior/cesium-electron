import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  on: (event, callback) => ipcRenderer.on(event, callback),
  minimize: () => ipcRenderer.invoke('minimize'),
  maximize: () => ipcRenderer.invoke('maximize'),
  restore: () => ipcRenderer.invoke('restore'),
  exit: () => ipcRenderer.invoke('exit'),
  context: (menu, payload) => ipcRenderer.invoke('context', { menu, payload }),
  set: (key: string, value: unknown) => ipcRenderer.invoke('set', { key, value }),
  get: (key: string) => ipcRenderer.invoke('get', key)
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

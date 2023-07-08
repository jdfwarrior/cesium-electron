import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  // add stuff in here to expose functionality from nodejs or electron to the renderer process
  // this object will be available in the renderer, on the global `window` object.
  // So in this case.. window.electron, based on the first parameter of the call to `exposeInMainWorld`

  on: (event: string, callback: () => void) => ipcRenderer.on(event, callback),
  minimize: () => ipcRenderer.invoke("minimize"),
  maximize: () => ipcRenderer.invoke("maximize"),
  restore: () => ipcRenderer.invoke("restore"),
  exit: () => ipcRenderer.invoke("exit"),
  context: (menu: any[], payload: unknown[]) =>
    ipcRenderer.invoke("context", { menu, payload }),
});

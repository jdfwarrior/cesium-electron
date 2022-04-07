const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    // add stuff in here to expose functionality from nodejs or electron to the renderer process
    // this object will be available in the renderer, on the global `window` object.
    // So in this case.. window.electron, based on the first parameter of the call to `exposeInMainWorld`

    on: (event, callback) => ipcRenderer.on(event, callback)
})
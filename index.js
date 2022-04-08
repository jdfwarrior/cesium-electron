const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("./express-server");

app.commandLine.appendSwitch("ignore-gpu-blacklist");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false,
  });

  console.log(process.env.cesiumenv);
  if (process.env.cesiumenv === "dev") {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadURL("http://localhost:3001");
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const getwindow = () => {
  try {
    const [win] = BrowserWindow.getAllWindows();
    return win;
  } catch (err) {
    return undefined;
  }
};
const minimize = () => {
  const win = getwindow();
  if (win) win.minimize();
};
const maximize = () => {
  const win = getwindow();
  if (win && win.isMaximized()) win.unmaximize();
  else if (win && !win.isMaximized()) win.maximize();
};
const restore = () => {
  const win = getwindow();
  if (win) win.restore();
};
const quit = () => {
  app.quit();
};

ipcMain.handle("minimize", minimize);
ipcMain.handle("maximize", maximize);
ipcMain.handle("restore", restore);
ipcMain.handle("exit", quit);

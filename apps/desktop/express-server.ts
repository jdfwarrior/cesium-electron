import { BrowserWindow, app } from "electron";
import * as path from "path";
import express from "express";
const server = express();

server.use(express.json());

server.post("/czml", (request, response) => {
  const [win] = BrowserWindow.getAllWindows();
  if (!win) return;
  win.webContents.send("czml", request.body);
  response.json({ status: "ok" });
});

const staticPath = path.resolve(path.join(app.getAppPath(), "..", "dist"));
server.use("/", express.static(staticPath));

server.listen(3001, () => console.log(`express server running on port 3001`));

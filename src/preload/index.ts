import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Operations } from "./index.d";

// Custom APIs for renderer
const api: Operations = {
  // DB
  execute: async (operation: string, ...args: any[]) =>
    await ipcRenderer.invoke("db:execute", operation, ...args),

  getCurrentProjectId: async () =>
    await ipcRenderer.invoke("getCurrentProjectId"),
  setCurrentProjectId: async (id: number) =>
    await ipcRenderer.invoke("setCurrentProjectId", id),

  // Setup
  completeSetup: async (projectPath: string, name: string, username: string) =>
    await ipcRenderer.invoke("completeSetup", projectPath, name, username),

  openSetupDialog: () => ipcRenderer.invoke("open_setup_dialog"),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

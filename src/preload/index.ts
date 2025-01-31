import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Operations } from './index.d'
// Custom APIs for renderer
const api: Operations = {
  getCurrentProjectId: async () => await ipcRenderer.invoke('getCurrentProjectId'),
  setCurrentProjectId: async (id: number) => await ipcRenderer.invoke('setCurrentProjectId', id),

  completeSetup: async (projectPath: string, name: string, username: string) =>
    await ipcRenderer.invoke('completeSetup', projectPath, name, username),

  createProject: async () => await ipcRenderer.invoke('createProject'),
  getProject: async (id: number) => await ipcRenderer.invoke('getProject', id),
  getAllProjects: async () => await ipcRenderer.invoke('getAllProjects'),
  deleteProject: async () => await ipcRenderer.invoke('deleteProject'),

  openSetupDialog: () => ipcRenderer.invoke('open_setup_dialog'),
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

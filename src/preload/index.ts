import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Operations } from './index.d'
import { Project } from '@shared/models'

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
  updateProject: async (project: Project) => await ipcRenderer.invoke('updateProject', project),

  // Folders
  getProjectFolders: async (projectId: number) =>
    await ipcRenderer.invoke('getProjectFolders', projectId),
  createFolder: async (project_id: number, parent_folder_id) =>
    await ipcRenderer.invoke('createFolder', project_id, parent_folder_id),
  updateFolder: async (folder: any) => await ipcRenderer.invoke('updateFolder', folder),
  deleteFolder: async (id: number) => await ipcRenderer.invoke('deleteFolder', id),
  getFolderById: async (id: number) => await ipcRenderer.invoke('getFolderById', id),
  getFolderTree: async (folderId: number) => await ipcRenderer.invoke('getFolderTree', folderId),

  // Chapters
  getChaptersByFolderId: async (folderId: number) =>
    await ipcRenderer.invoke('getChaptersByFolderId', folderId),
  createChapter: async (parent_type: string, parent_id: number) =>
    await ipcRenderer.invoke('createChapter', parent_type, parent_id),
  updateChapter: async (chapter: any) => await ipcRenderer.invoke('updateChapter', chapter),
  getChapterById: async (id: number) => await ipcRenderer.invoke('getChapterById', id),

  openSetupDialog: () => ipcRenderer.invoke('open_setup_dialog')
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

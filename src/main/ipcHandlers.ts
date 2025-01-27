
import { useProject } from './api/project';

export function registerIpcHandlers(ipcMain: Electron.IpcMain) {
  ipcMain.handle('createProject', async () => useProject().create())
  ipcMain.handle('getAllProjects', async () => useProject().getAll())
}

import { dialog } from 'electron';
import { useProject } from './api/project';
import { completeSetup, getCurrentProjectId, setCurrentProjectId } from './api';

export function registerIpcHandlers(ipcMain: Electron.IpcMain) {
  // setup
  ipcMain.handle('completeSetup', async (_, projectPath: string, name: string, username: string) => completeSetup(projectPath, name, username))
  
  // root
  ipcMain.handle('getCurrentProjectId', async () => getCurrentProjectId())
  ipcMain.handle('setCurrentProjectId', async (_, id: number) => setCurrentProjectId(id))

  // projects
  ipcMain.handle('createProject', async () => useProject().create())
  ipcMain.handle('getAllProjects', async () => useProject().getAll())
  ipcMain.handle('deleteProject', async (_, id: number) => useProject().singleDelete(id))
  ipcMain.handle('getProject', async (_, id: number) => useProject().get(id))

  // dialogs
  ipcMain.handle('open_setup_dialog', () =>
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => result)
  )
}
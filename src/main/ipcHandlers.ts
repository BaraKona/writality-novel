import { dialog } from 'electron'
import { useProject } from './api/project'

import { completeSetup, getCurrentProjectId, setCurrentProjectId } from './api'
import { useFolder } from './db/folder'

export function registerIpcHandlers(ipcMain: Electron.IpcMain) {
  // setup
  ipcMain.handle('completeSetup', async (_, projectPath: string, name: string, username: string) =>
    completeSetup(projectPath, name, username)
  )

  // root
  ipcMain.handle('getCurrentProjectId', async () => getCurrentProjectId())
  ipcMain.handle('setCurrentProjectId', async (_, id: number) => setCurrentProjectId(id))

  // projects
  ipcMain.handle('createProject', async () => useProject().create())
  ipcMain.handle('getAllProjects', async () => useProject().getAll())
  ipcMain.handle('deleteProject', async (_, id: number) => useProject().singleDelete(id))
  ipcMain.handle('getProject', async (_, id: number) => useProject().get(id))
  ipcMain.handle('updateProject', async (_, project: any) => useProject().update(project))

  // folders
  ipcMain.handle('getProjectFolders', async (_, projectId: number) =>
    useFolder().getFoldersByProjectId(projectId)
  )
  ipcMain.handle('createFolder', async (_, project_id: number, parent_folder_id: number) =>
    useFolder().createFolder(project_id, parent_folder_id)
  )
  ipcMain.handle('updateFolder', async (_, folder: any) => useFolder().updateFolder(folder))
  ipcMain.handle('deleteFolder', async (_, id: number) => useFolder().deleteFolder(id))
  ipcMain.handle('getFolderById', async (_, id: number) => useFolder().getFolderById(id))

  // dialogs
  ipcMain.handle('open_setup_dialog', () =>
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => result)
  )
}

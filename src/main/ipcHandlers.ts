import { dialog } from 'electron'

import { completeSetup, getCurrentProjectId, setCurrentProjectId } from './api'
import { useFolder } from './db/folder'
import { useChapter } from './db/chapters'
import { useProject } from './db/project'

export function registerIpcHandlers(ipcMain: Electron.IpcMain) {
  // setup
  ipcMain.handle('completeSetup', async (_, projectPath: string, name: string, username: string) =>
    completeSetup(projectPath, name, username)
  )

  // root
  ipcMain.handle('getCurrentProjectId', async () => getCurrentProjectId())
  ipcMain.handle('setCurrentProjectId', async (_, id: number) => setCurrentProjectId(id))

  // projects
  ipcMain.handle('createProject', async () => useProject().createProject())
  ipcMain.handle('getAllProjects', async () => useProject().getAllProjects())
  ipcMain.handle('deleteProject', async (_, id: number) => useProject().deleteProject(id))
  ipcMain.handle('getProject', async (_, id: number) => useProject().getProject(id))
  ipcMain.handle('updateProject', async (_, project: any) => useProject().updateProject(project))
  ipcMain.handle('getProjectFiles', async (_, project_id: number) =>
    useProject().getProjectFiles(project_id)
  )

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
  ipcMain.handle('getFolderTree', async (_, folderId: number) =>
    useFolder().getFolderTree(folderId)
  )

  // chapter
  ipcMain.handle('getChaptersByFolderId', async (_, folderId: number) =>
    useChapter().getChaptersByFolderId(folderId)
  )
  ipcMain.handle('createChapter', async (_, parent_type: string, parent_id: number) =>
    useChapter().createChapter(parent_type, parent_id)
  )
  ipcMain.handle('updateChapter', async (_, chapter: any) => useChapter().updateChapter(chapter))
  ipcMain.handle('getChapterById', async (_, id: number) => useChapter().getChapterById(id))

  // dialogs
  ipcMain.handle('open_setup_dialog', () =>
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => result)
  )
}

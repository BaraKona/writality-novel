import { ElectronAPI } from '@electron-toolkit/preload'
import { Folder, Project, ProjectDirectory } from '@shared/models'
export interface Operations {
  completeSetup(projectPath: string, name: string, username: string): Promise<void>

  getCurrentProjectId(): Promise<ProjectDirectory>
  setCurrentProjectId(id: number): Promise<void>

  createProject(): Promise<Project>
  getAllProjects(): Promise<Project[]>
  getProject(id: number): Promise<Project>
  deleteProject(id: number): Promise<Number>
  updateProject(project: Project): Promise<Project>

  // Folders
  getProjectFolders(projectId: number): Promise<Folder[]>
  createFolder(project_id: number, parent_folder_id: number): Promise<Folder>
  updateFolder(folder: any): Promise<Folder>
  deleteFolder(id: number): Promise<Number>
  getFolderById(id: number): Promise<Folder>

  openSetupDialog: () => Promise<Electron.OpenDialogReturnValue>
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: Operations
  }
}

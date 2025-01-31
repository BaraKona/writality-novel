import { ElectronAPI } from '@electron-toolkit/preload'
import { Project, ProjectDirectory } from '@shared/models'
export interface Operations {
  completeSetup(projectPath: string, name: string, username: string): Promise<void>

  getCurrentProjectId(): Promise<ProjectDirectory>
  setCurrentProjectId(id: number): Promise<void>

  createProject(): Promise<void>
  getAllProjects(): Promise<void>
  getProject(id: number): Promise<void>
  deleteProject(id: number): Promise<void>
  updateProject(project: Project): Promise<void>


  openSetupDialog: () => Promise<Electron.OpenDialogReturnValue>
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: Operations
  }
}

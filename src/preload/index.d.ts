import { ElectronAPI } from '@electron-toolkit/preload'

export interface Operations {
  createProject(): Promise<void>
  getAllProjects(): Promise<void>
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: Operations
  }
}

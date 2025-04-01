import { ElectronAPI } from "@electron-toolkit/preload";
import { ProjectDirectory } from "@shared/models";
export interface Operations {
  execute: (operation: string, ...args: any[]) => Promise<any>;

  completeSetup(
    projectPath: string,
    name: string,
    username: string,
  ): Promise<void>;

  getCurrentProjectId(): Promise<ProjectDirectory>;
  setCurrentProjectId(id: number): Promise<void>;

  openSetupDialog: () => Promise<Electron.OpenDialogReturnValue>;
}
declare global {
  interface Window {
    electron: ElectronAPI;
    api: Operations;
  }
}

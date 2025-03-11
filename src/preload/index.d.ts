import { ElectronAPI } from "@electron-toolkit/preload";
import { Chapter, Folder, Project, ProjectDirectory } from "@shared/models";
export interface Operations {
  execute: (operation: string, ...args: any[]) => Promise<any>;

  completeSetup(
    projectPath: string,
    name: string,
    username: string,
  ): Promise<void>;

  getCurrentProjectId(): Promise<ProjectDirectory>;
  setCurrentProjectId(id: number): Promise<void>;

  createProject(): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project>;
  deleteProject(id: number): Promise<Number>;
  updateProject(project: Project): Promise<Project>;
  getProjectFiles(project_id: number): Promise<string[]>;

  // Folders
  getProjectFolders(projectId: number): Promise<Folder[]>;
  createFolder(
    project_id: number,
    parent_folder_id: number | null,
  ): Promise<Folder>;
  updateFolder(folder: any): Promise<Folder>;
  deleteFolder(id: number): Promise<Number>;
  getFolderById(id: number): Promise<Folder>;
  getFolderTree(folderId: number): Promise<Folder>;

  // Chapters
  getChaptersByFolderId(folderId: number): Promise<Chapter[]>;
  createChapter(parent_type: string, parent_id: number): Promise<Chapter>;
  updateChapter(chapter: Chapter): Promise<Chapter>;
  getChapterById(id: number): Promise<Chapter>;

  openSetupDialog: () => Promise<Electron.OpenDialogReturnValue>;
}
declare global {
  interface Window {
    electron: ElectronAPI;
    api: Operations;
  }
}

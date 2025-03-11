import { Folder } from "@shared/models";
import { database, deserialize, serialize } from ".";
import { useChapter } from "./chapters";

// Folders
const CREATE_FOLDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )
`;

const CREATE_FOLDER_CLOSURE_TABLE = `
  CREATE TABLE IF NOT EXISTS folder_closure (
    ancestor_id INTEGER NOT NULL,
    descendant_id INTEGER NOT NULL,
    depth INTEGER NOT NULL,
    PRIMARY KEY (ancestor_id, descendant_id),
    FOREIGN KEY (ancestor_id) REFERENCES folders(id) ON DELETE CASCADE,
    FOREIGN KEY (descendant_id) REFERENCES folders(id) ON DELETE CASCADE
  )
`;

const INSERT_FOLDER = `
  INSERT INTO folders (project_id, name, position, created_at, updated_at)
  VALUES (?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`;

const INSERT_FOLDER_CLOSURE = `
  INSERT INTO folder_closure (ancestor_id, descendant_id, depth)
  VALUES (?, ?, ?)
`;

const SELECT_FOLDERS_BY_PROJECT_ID = `
  SELECT * FROM folders
  WHERE project_id = ?
  ORDER BY position ASC
`;

const SELECT_FOLDERS_BY_PARENT_FOLDER_ID = `
  SELECT * FROM folders
  WHERE id IN (
    SELECT descendant_id FROM folder_closure
    WHERE ancestor_id = ? AND depth = 1
  )
  ORDER BY position ASC
`;

const SELECT_FOLDER_BY_ID = "SELECT * FROM folders WHERE id = ?";

const UPDATE_FOLDER = `
  UPDATE folders
  SET name = ?, description = ?, emoji = ?, position = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`;

const DELETE_FOLDER = "DELETE FROM folders WHERE id = ?";

// database.exec(CREATE_FOLDER_CLOSURE_TABLE)
// database.exec(CREATE_FOLDERS_TABLE)

export const useFolder = () => {
  function createFolder(
    projectId: number,
    parentFolderId: number | null,
  ): { id: number } {
    try {
      // Insert the folder
      const stmt = database.prepare(INSERT_FOLDER);
      const result = stmt.run(projectId, "New Folder");
      const folderId = result.lastInsertRowid as number;

      // Insert into folder_closure for self-reference (depth 0)
      const closureStmt = database.prepare(INSERT_FOLDER_CLOSURE);
      closureStmt.run(folderId, folderId, 0);

      // If the folder has a parent, insert additional rows for the hierarchy
      if (parentFolderId) {
        const hierarchyStmt = database.prepare(`
          INSERT INTO folder_closure (ancestor_id, descendant_id, depth)
          SELECT ancestor_id, ?, depth + 1
          FROM folder_closure
          WHERE descendant_id = ?
        `);
        hierarchyStmt.run(folderId, parentFolderId);
      }

      return { id: folderId };
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  }

  function getFoldersByProjectId(projectId: number): Folder[] {
    try {
      const stmt = database.prepare(SELECT_FOLDERS_BY_PROJECT_ID);
      const folders = stmt.all(projectId) as Folder[];
      return folders.map((folder) => ({
        ...folder,
        description: deserialize(folder.description),
        emoji: deserialize(folder.emoji),
        children: getFoldersByParentFolderId(folder.id!), // Recursively fetch children
        chapters: useChapter().getChaptersByFolderId(folder.id!), // Fetch chapters
      }));
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }
  }

  function getFoldersByParentFolderId(parentFolderId: number): Folder[] {
    try {
      const stmt = database.prepare(SELECT_FOLDERS_BY_PARENT_FOLDER_ID);
      const folders = stmt.all(parentFolderId) as Folder[];

      return folders.map((folder) => {
        // Fetch nested folders recursively
        const nestedFolders = getFoldersByParentFolderId(folder.id!);

        // Fetch chapters for the current folder
        const chapters = useChapter().getChaptersByFolderId(folder.id!);

        return {
          ...folder,
          description: deserialize(folder.description),
          emoji: deserialize(folder.emoji),
          children: nestedFolders, // Nested folders
          chapters: chapters, // Chapters in this folder
        };
      });
    } catch (error) {
      console.error("Error fetching nested folders:", error);
      throw error;
    }
  }

  function updateFolder(folder: Folder): Folder | null {
    try {
      const stmt = database.prepare(UPDATE_FOLDER);
      stmt.run(
        folder.name,
        serialize(folder.description),
        serialize(folder.emoji),
        folder.position,
        folder.id,
      );
      return getFolderById(folder.id!); // Return the updated folder
    } catch (error) {
      console.error("Error updating folder:", error);
      throw error;
    }
  }

  function deleteFolder(id: number): boolean {
    try {
      const stmt = database.prepare(DELETE_FOLDER);
      const result = stmt.run(id);
      return result.changes > 0; // Return true if a folder was deleted
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  }

  function getFolderById(id: number): Folder | null {
    try {
      const stmt = database.prepare(SELECT_FOLDER_BY_ID);
      const folder = stmt.get(id) as Folder | undefined;
      if (!folder) return null;

      // Fetch nested folders recursively
      const nestedFolders = getFoldersByParentFolderId(folder.id!);

      // Fetch chapters for the current folder
      const chapters = useChapter().getChaptersByFolderId(folder.id!);

      return {
        ...folder,
        description: deserialize(folder.description),
        emoji: deserialize(folder.emoji),
        children: nestedFolders, // Nested folders
        chapters: chapters, // Chapters in this folder
      };
    } catch (error) {
      console.error("Error fetching folder:", error);
      throw error;
    }
  }

  function getFolderShallowChildren(folderId: number): Folder[] {
    try {
      const stmt = database.prepare(SELECT_FOLDERS_BY_PARENT_FOLDER_ID);
      const folders = stmt.all(folderId) as Folder[];
      return folders;
    } catch (error) {
      console.error("Error fetching folder children:", error);
      throw error;
    }
  }

  function getFolderTree(folderId: number): Folder | null {
    try {
      const folder = getFolderById(folderId);
      if (!folder) return null;

      // Recursively fetch nested folders and chapters
      folder.children = getFolderShallowChildren(folder.id!);
      folder.chapters = useChapter().getChaptersByFolderId(folder.id!);

      return folder;
    } catch (error) {
      console.error("Error fetching folder tree:", error);
      throw error;
    }
  }

  return {
    createFolder,
    getFoldersByProjectId,
    updateFolder,
    deleteFolder,
    getFolderById,
    getFoldersByParentFolderId,
    getFolderTree,
  };
};

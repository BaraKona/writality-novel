import { Chapter, Folder } from '@shared/models'
import { database, deserialize, serialize } from '.'
import { useChapter } from './chapters'

// Folders
const CREATE_FOLDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    parent_folder_id INTEGER, -- Reference to the parent folder
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE
  )
`

const INSERT_FOLDER = `
  INSERT INTO folders (project_id, parent_folder_id, name, description, emoji, position, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`
const SELECT_FOLDERS_BY_PROJECT_ID = `
  SELECT * FROM folders
  WHERE project_id = ? AND parent_folder_id IS NULL
  ORDER BY position ASC
`
const SELECT_FOLDERS_BY_PARENT_FOLDER_ID = `
  SELECT * FROM folders
  WHERE parent_folder_id = ?
  ORDER BY position ASC
`
const SELECT_FOLDER_BY_ID = 'SELECT * FROM folders WHERE id = ?'
const UPDATE_FOLDER = `
  UPDATE folders
  SET name = ?, description = ?, emoji = ?, position = ?, parent_folder_id = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`

const DELETE_FOLDER = 'DELETE FROM folders WHERE id = ?'

database.exec(CREATE_FOLDERS_TABLE)

export const useFolder = () => {
  function createFolder(projectId: number, parentFolderId: number | null): { id: number } {
    try {
      const stmt = database.prepare(INSERT_FOLDER)
      const result = stmt.run(
        projectId,
        parentFolderId || null, // Handle NULL for top-level folders
        'New Folder',
        serialize([]),
        null,
        getFoldersByProjectId(projectId).length
      )
      return { id: result.lastInsertRowid as number }
    } catch (error) {
      console.error('Error creating folder:', error)
      throw error
    }
  }

  function getFoldersByProjectId(projectId: number): Folder[] {
    try {
      const stmt = database.prepare(SELECT_FOLDERS_BY_PROJECT_ID)
      const folders = stmt.all(projectId) as Folder[]
      return folders.map((folder) => ({
        ...folder,
        description: deserialize(folder.description),
        emoji: deserialize(folder.emoji),
        children: getFoldersByParentFolderId(folder.id!), // Recursively fetch children
        chapters: useChapter().getChaptersByFolderId(folder.id!) // Fetch chapters
      }))
    } catch (error) {
      console.error('Error fetching folders:', error)
      throw error
    }
  }

  function getFoldersByParentFolderId(parentFolderId: number): Folder[] {
    try {
      const stmt = database.prepare(SELECT_FOLDERS_BY_PARENT_FOLDER_ID)
      const folders = stmt.all(parentFolderId) as Folder[]

      return folders.map((folder) => {
        // Fetch nested folders recursively
        const nestedFolders = getFoldersByParentFolderId(folder.id!)

        // Fetch chapters for the current folder
        const chapters = useChapter().getChaptersByFolderId(folder.id!)

        return {
          ...folder,
          description: deserialize(folder.description),
          emoji: deserialize(folder.emoji),
          children: nestedFolders, // Nested folders
          chapters: chapters // Chapters in this folder
        }
      })
    } catch (error) {
      console.error('Error fetching nested folders:', error)
      throw error
    }
  }

  function updateFolder(folder: Folder): Folder | null {
    try {
      const stmt = database.prepare(UPDATE_FOLDER)
      stmt.run(
        folder.name,
        serialize(folder.description),
        serialize(folder.emoji),
        folder.position,
        folder.parent_folder_id || null, // Handle NULL for top-level folders
        folder.id
      )
      return getFolderById(folder.id!) // Return the updated folder
    } catch (error) {
      console.error('Error updating folder:', error)
      throw error
    }
  }

  function deleteFolder(id: number): boolean {
    try {
      const stmt = database.prepare(DELETE_FOLDER)
      const result = stmt.run(id)
      return result.changes > 0 // Return true if a folder was deleted
    } catch (error) {
      console.error('Error deleting folder:', error)
      throw error
    }
  }

  function getFolderById(id: number): Folder | null {
    try {
      const stmt = database.prepare(SELECT_FOLDER_BY_ID)
      const folder = stmt.get(id) as Folder | undefined
      if (!folder) return null

      // Fetch nested folders recursively
      const nestedFolders = getFoldersByParentFolderId(folder.id!)

      // Fetch chapters for the current folder
      const chapters = useChapter().getChaptersByFolderId(folder.id!)

      return {
        ...folder,
        description: deserialize(folder.description),
        emoji: deserialize(folder.emoji),
        children: nestedFolders, // Nested folders
        chapters: chapters // Chapters in this folder
      }
    } catch (error) {
      console.error('Error fetching folder:', error)
      throw error
    }
  }

  function getFolderShallowChildren(folderId: number): Folder[] {
    try {
      const stmt = database.prepare(SELECT_FOLDERS_BY_PARENT_FOLDER_ID)
      const folders = stmt.all(folderId) as Folder[]
      return folders
    } catch (error) {
      console.error('Error fetching folder children:', error)
      throw error
    }
  }

  function getFolderTree(folderId: number): Folder | null {
    try {
      const folder = getFolderById(folderId)
      if (!folder) return null

      // Recursively fetch nested folders and chapters
      folder.children = getFolderShallowChildren(folder.id!)
      folder.chapters = useChapter().getChaptersByFolderId(folder.id!)

      return folder
    } catch (error) {
      console.error('Error fetching folder tree:', error)
      throw error
    }
  }

  return {
    createFolder,
    getFoldersByProjectId,
    updateFolder,
    deleteFolder,
    getFolderById,
    getFoldersByParentFolderId,
    getFolderTree
  }
}

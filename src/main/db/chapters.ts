import { Chapter, Folder } from '@shared/models'
import { database, deserialize, serialize } from '.'

// Chapters
const INSERT_CHAPTER = `
  INSERT INTO chapters (parent_type, parent_id, name, description, position, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`

const SELECT_CHAPTERS_BY_PROJECT_ID = `
  SELECT * FROM chapters
  WHERE parent_type = 'project' AND parent_id = ?
  ORDER BY position ASC
`

const SELECT_CHAPTERS_BY_FOLDER_ID = `
  SELECT * FROM chapters
  WHERE parent_type = 'folder' AND parent_id = ?
  ORDER BY position ASC
`

const SELECT_CHAPTER_BY_ID = 'SELECT * FROM chapters WHERE id = ?'

const UPDATE_CHAPTER = `
  UPDATE chapters
  SET name = ?, description = ?, position = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`

const DELETE_CHAPTER = 'DELETE FROM chapters WHERE id = ?'

const CREATE_CHAPTERS_TABLE = `
  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_type TEXT NOT NULL, -- 'project' or 'folder'
    parent_id INTEGER NOT NULL, -- ID of the project or folder
    name TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
  )
`

database.exec(CREATE_CHAPTERS_TABLE)

export const useChapter = () => {
  function createChapter(parent_type: string, parent_id: number): { id: number } {
    try {
      const stmt = database.prepare(INSERT_CHAPTER)
      const result = stmt.run(parent_type, parent_id, 'New Chapter', null, 0)
      return { id: result.lastInsertRowid as number }
    } catch (error) {
      console.error('Error creating chapter:', error)
      throw error
    }
  }

  function getChaptersByProjectId(projectId: number): Chapter[] {
    try {
      const stmt = database.prepare(SELECT_CHAPTERS_BY_PROJECT_ID)
      const chapters = stmt.all(projectId) as Chapter[]
      return chapters.map((chapter) => ({
        ...chapter,
        description: deserialize(chapter.description)
      }))
    } catch (error) {
      console.error('Error fetching chapters by project ID:', error)
      throw error
    }
  }

  function getChaptersByFolderId(folderId: number): Chapter[] {
    try {
      const stmt = database.prepare(SELECT_CHAPTERS_BY_FOLDER_ID)
      const chapters = stmt.all(folderId) as Chapter[]
      return chapters.map((chapter) => ({
        ...chapter,
        description: deserialize(chapter.description)
      }))
    } catch (error) {
      console.error('Error fetching chapters by folder ID:', error)
      throw error
    }
  }

  function updateChapter(chapter: Chapter): Chapter | null {
    try {
      const stmt = database.prepare(UPDATE_CHAPTER)
      stmt.run(chapter.name, serialize(chapter.description), chapter.position, chapter.id)
      return getChapterById(chapter.id!) // Return the updated chapter
    } catch (error) {
      console.error('Error updating chapter:', error)
      throw error
    }
  }

  function deleteChapter(id: number): boolean {
    try {
      const stmt = database.prepare(DELETE_CHAPTER)
      const result = stmt.run(id)
      return result.changes > 0 // Return true if a chapter was deleted
    } catch (error) {
      console.error('Error deleting chapter:', error)
      throw error
    }
  }

  function getChapterById(id: number): Chapter | null {
    try {
      const stmt = database.prepare(SELECT_CHAPTER_BY_ID)
      const chapter = stmt.get(id) as Chapter | undefined
      if (!chapter) return null
      return {
        ...chapter,
        description: deserialize(chapter.description)
      }
    } catch (error) {
      console.error('Error fetching chapter:', error)
      throw error
    }
  }

  return {
    createChapter,
    getChaptersByFolderId,
    updateChapter,
    deleteChapter,
    getChapterById,
    getChaptersByProjectId
  }
}

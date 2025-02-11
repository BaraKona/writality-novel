import { Chapter, Folder } from '@shared/models'
import { database, deserialize, serialize } from '.'

// Chapters
const INSERT_CHAPTER = `
  INSERT INTO chapters (parent_type, parent_id, name, position, created_at, updated_at)
  VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`

database.exec(CREATE_CHAPTERS_TABLE)

export const useChapter = () => {
  // function createChapter(parent_type: string, parent_id: number): { id: number } {
  //   try {
  //     const stmt = database.prepare(INSERT_CHAPTER)
  //     const result = stmt.run(parent_type, parent_id, 'New Chapter', 0)
  //     return { id: result.lastInsertRowid as number }
  //   } catch (error) {
  //     console.error('Error creating chapter:', error)
  //     throw error
  //   }
  // }

  function createChapter(parent_type: string, parent_id: number): { id: number } {
    try {
      // Validate that the parent_id exists in the corresponding table
      if (parent_type === 'project') {
        const projectStmt = database.prepare('SELECT id FROM projects WHERE id = ?')
        const project = projectStmt.get(parent_id)
        if (!project) {
          throw new Error(`Project with ID ${parent_id} does not exist`)
        }
      } else if (parent_type === 'folder') {
        const folderStmt = database.prepare('SELECT id FROM folders WHERE id = ?')
        const folder = folderStmt.get(parent_id)
        if (!folder) {
          throw new Error(`Folder with ID ${parent_id} does not exist`)
        }
      } else {
        throw new Error(`Invalid parent_type: ${parent_type}`)
      }

      const stmt = database.prepare(INSERT_CHAPTER)
      const result = stmt.run(parent_type, parent_id, 'New Chapter', 0)
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

  function getChapterById(
    id: number
  ): (Chapter & { ancestors: { id: number; name: string; type: string }[] }) | null {
    try {
      // Fetch the chapter
      const chapterStmt = database.prepare(SELECT_CHAPTER_BY_ID)
      const chapter = chapterStmt.get(id) as Chapter | undefined
      if (!chapter) return null

      // Fetch ancestors using the corrected query
      const ancestorsStmt = database.prepare(`
      WITH RECURSIVE ancestor_hierarchy AS (
        SELECT
          id,
          name,
          project_id,
          parent_folder_id
        FROM folders
        WHERE id = ?

        UNION ALL

        SELECT
          f.id,
          f.name,
          f.project_id,
          f.parent_folder_id
        FROM folders f
        INNER JOIN ancestor_hierarchy ah ON f.id = ah.parent_folder_id
      )
      SELECT
        id,
        name,
        'folder' AS type
      FROM ancestor_hierarchy

      UNION ALL

      SELECT
        p.id,
        p.name,
        'project' AS type
      FROM projects p
      WHERE p.id = (SELECT project_id FROM ancestor_hierarchy LIMIT 1)
    `)

      const ancestors = ancestorsStmt.all(chapter.parent_id) as {
        id: number
        name: string
        type: string
      }[]

      return {
        ...chapter,
        description: deserialize(chapter.description),
        ancestors: ancestors.reverse() // Reverse to get the correct order (project -> folder -> chapter)
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

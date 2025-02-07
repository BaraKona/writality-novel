import { Chapter, Folder } from '@shared/models'
import { database, deserialize, serialize } from '.'

// Chapters
const INSERT_CHAPTER = `
  INSERT INTO chapters (folder_id, name, description, position, created_at, updated_at)
  VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`

const SELECT_CHAPTERS_BY_FOLDER_ID =
  'SELECT * FROM chapters WHERE folder_id = ? ORDER BY position ASC'

const SELECT_CHAPTER_BY_ID = 'SELECT * FROM chapters WHERE id = ?'

const UPDATE_CHAPTER = `
  UPDATE chapters
  SET name = ?, description = ?, position = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`

const DELETE_CHAPTER = 'DELETE FROM chapters WHERE id = ?'

export function createChapter(chapter: Chapter): { id: number } {
  try {
    const stmt = database.prepare(INSERT_CHAPTER)
    const result = stmt.run(
      chapter.folder_id,
      chapter.name,
      serialize(chapter.description),
      chapter.position
    )
    return { id: result.lastInsertRowid as number }
  } catch (error) {
    console.error('Error creating chapter:', error)
    throw error
  }
}

export function getChaptersByFolderId(folderId: number): Chapter[] {
  try {
    const stmt = database.prepare(SELECT_CHAPTERS_BY_FOLDER_ID)
    const chapters = stmt.all(folderId) as Chapter[]
    return chapters.map((chapter) => ({
      ...chapter,
      description: deserialize(chapter.description)
    }))
  } catch (error) {
    console.error('Error fetching chapters:', error)
    throw error
  }
}

export function updateChapter(chapter: Chapter): Chapter | null {
  try {
    const stmt = database.prepare(UPDATE_CHAPTER)
    stmt.run(chapter.name, serialize(chapter.description), chapter.position, chapter.id)
    return getChapterById(chapter.id!) // Return the updated chapter
  } catch (error) {
    console.error('Error updating chapter:', error)
    throw error
  }
}

export function deleteChapter(id: number): boolean {
  try {
    const stmt = database.prepare(DELETE_CHAPTER)
    const result = stmt.run(id)
    return result.changes > 0 // Return true if a chapter was deleted
  } catch (error) {
    console.error('Error deleting chapter:', error)
    throw error
  }
}

export function getChapterById(id: number): Chapter | null {
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

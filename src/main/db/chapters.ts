import { Chapter } from "@shared/models";
import { database, deserialize, serialize } from ".";

// Chapters

// Inserts a new chapter with the given parent type and parent ID
const INSERT_CHAPTER = `
  INSERT INTO chapters (name, position, created_at, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`;

// Inserts a new chapter parent relationship
const INSERT_CHAPTER_PARENT = `
  INSERT INTO chapter_parents (chapter_id, parent_type, parent_id)
  VALUES (?, ?, ?)
`;

// Selects all chapters by project ID
const SELECT_CHAPTERS_BY_PROJECT_ID = `
  SELECT c.*
  FROM chapters c
  JOIN chapter_parents cp ON c.id = cp.chapter_id
  WHERE cp.parent_type = 'project' AND cp.parent_id = ?
  ORDER BY c.position ASC
`;

const SELECT_CHAPTERS_BY_FOLDER_ID = `
  SELECT c.*
  FROM chapters c
  JOIN chapter_parents cp ON c.id = cp.chapter_id
  WHERE cp.parent_type = 'folder' AND cp.parent_id = ?
  ORDER BY c.position ASC
`;

const SELECT_CHAPTER_BY_ID = "SELECT * FROM chapters WHERE id = ?";

const UPDATE_CHAPTER = `
  UPDATE chapters
  SET name = ?, description = ?, position = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`;

const DELETE_CHAPTER = "DELETE FROM chapters WHERE id = ?";

const DELETE_CHAPTER_PARENTS =
  "DELETE FROM chapter_parents WHERE chapter_id = ?";

const CREATE_CHAPTERS_TABLE = `
  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

const CREATE_CHAPTER_PARENT_TABLE = `
  CREATE TABLE IF NOT EXISTS chapter_parents (
    chapter_id INTEGER NOT NULL,
    parent_type TEXT NOT NULL, -- 'project' or 'folder'
    parent_id INTEGER NOT NULL,
    PRIMARY KEY (chapter_id, parent_type, parent_id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
  )
`;

// database.exec(CREATE_CHAPTER_PARENT_TABLE)
// database.exec(CREATE_CHAPTERS_TABLE)

export const useChapter = () => {
  function createChapter(
    parent_type: string,
    parent_id: number,
  ): { id: number } {
    console.log({ parent_type, parent_id });
    try {
      // Insert the chapter
      const stmt = database.prepare(INSERT_CHAPTER);
      const result = stmt.run("New Chapter", 0);
      const chapterId = result.lastInsertRowid as number;

      // Link the chapter to its parent
      const parentStmt = database.prepare(INSERT_CHAPTER_PARENT);
      parentStmt.run(chapterId, parent_type, parent_id);

      return { id: chapterId };
    } catch (error) {
      console.error("Error creating chapter:", error);
      throw error;
    }
  }

  function getChaptersByProjectId(projectId: number): Chapter[] {
    try {
      const stmt = database.prepare(SELECT_CHAPTERS_BY_PROJECT_ID);
      const chapters = stmt.all(projectId) as Chapter[];
      return chapters.map((chapter) => ({
        ...chapter,
        description: deserialize(chapter.description),
      }));
    } catch (error) {
      console.error("Error fetching chapters by project ID:", error);
      throw error;
    }
  }

  function getChaptersByFolderId(folderId: number): Chapter[] {
    try {
      const stmt = database.prepare(SELECT_CHAPTERS_BY_FOLDER_ID);
      const chapters = stmt.all(folderId) as Chapter[];
      return chapters.map((chapter) => ({
        ...chapter,
        description: deserialize(chapter.description),
      }));
    } catch (error) {
      console.error("Error fetching chapters by folder ID:", error);
      throw error;
    }
  }

  function updateChapter(chapter: Chapter): Chapter | null {
    try {
      const stmt = database.prepare(UPDATE_CHAPTER);
      stmt.run(
        chapter.name,
        serialize(chapter.description),
        chapter.position,
        chapter.id,
      );
      return getChapterById(chapter.id!); // Return the updated chapter
    } catch (error) {
      console.error("Error updating chapter:", error);
      throw error;
    }
  }

  function deleteChapter(id: number): boolean {
    try {
      // Delete chapter parents first
      const deleteParentsStmt = database.prepare(DELETE_CHAPTER_PARENTS);
      deleteParentsStmt.run(id);

      // Delete the chapter
      const stmt = database.prepare(DELETE_CHAPTER);
      const result = stmt.run(id);
      return result.changes > 0; // Return true if a chapter was deleted
    } catch (error) {
      console.error("Error deleting chapter:", error);
      throw error;
    }
  }

  function getChapterById(
    id: number,
  ):
    | (Chapter & { ancestors: { id: number; name: string; type: string }[] })
    | null {
    try {
      // Fetch the chapter
      const chapterStmt = database.prepare(SELECT_CHAPTER_BY_ID);
      const chapter = chapterStmt.get(id) as Chapter | undefined;
      if (!chapter) return null;

      // Fetch the parent of the chapter (either a folder or a project)
      const parentStmt = database.prepare(`
      SELECT parent_type, parent_id
      FROM chapter_parents
      WHERE chapter_id = ?
    `);
      const parent = parentStmt.get(id) as
        | { parent_type: string; parent_id: number }
        | undefined;

      if (!parent) {
        return {
          ...chapter,
          description: deserialize(chapter.description),
          ancestors: [], // No ancestors if no parent is found
        };
      }

      // Fetch ancestors based on the parent type
      let ancestors: { id: number; name: string; type: string }[] = [];

      if (parent.parent_type === "folder") {
        // If the parent is a folder, fetch its hierarchy using the folder_closure table
        const ancestorsStmt = database.prepare(`
        WITH RECURSIVE folder_hierarchy AS (
          SELECT
            f.id,
            f.name,
            'folder' AS type,
            0 AS depth
          FROM folders f
          WHERE f.id = ?

          UNION ALL

          SELECT
            f.id,
            f.name,
            'folder' AS type,
            fh.depth + 1 AS depth
          FROM folders f
          JOIN folder_closure fc ON f.id = fc.ancestor_id
          JOIN folder_hierarchy fh ON fc.descendant_id = fh.id
          WHERE fc.depth = 1
        )
        SELECT id, name, type FROM folder_hierarchy
        ORDER BY depth DESC
      `);
        ancestors = ancestorsStmt.all(parent.parent_id) as {
          id: number;
          name: string;
          type: string;
        }[];
      } else if (parent.parent_type === "project") {
        // If the parent is a project, fetch the project directly
        const projectStmt = database.prepare(`
        SELECT id, name, 'project' AS type
        FROM projects
        WHERE id = ?
      `);
        const project = projectStmt.get(parent.parent_id) as
          | { id: number; name: string; type: string }
          | undefined;
        if (project) {
          ancestors = [project];
        }
      }

      return {
        ...chapter,
        description: deserialize(chapter.description),
        ancestors: ancestors, // Return the ancestors in the correct order
      };
    } catch (error) {
      console.error("Error fetching chapter:", error);
      throw error;
    }
  }

  return {
    createChapter,
    getChaptersByFolderId,
    updateChapter,
    deleteChapter,
    getChapterById,
    getChaptersByProjectId,
  };
};

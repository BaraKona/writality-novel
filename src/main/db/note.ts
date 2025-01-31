import { database } from './index';

// Create table for notes if not exists, with timestamps
// Adds created_at (set when the note is created) and updated_at (set when the note is updated)
database?.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    emoji TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
  )
`);

export function createNote(projectId, content) {
  const stmt = database.prepare(
    'INSERT INTO notes (project_id, content, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
  );
  return stmt.run(projectId, content);
}

export function getNote(id) {
  const stmt = database.prepare('SELECT * FROM notes WHERE id = ?');
  return stmt.get(id);
}

export function updateNote(id, content) {
  const stmt = database.prepare(
    'UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  return stmt.run(content, id);
}

export function deleteNote(id) {
  const stmt = database.prepare('DELETE FROM notes WHERE id = ?');
  return stmt.run(id);
}

export function getNotesByProject(projectId) {
  const stmt = database.prepare(
    'SELECT * FROM notes WHERE project_id = ? ORDER BY created_at ASC' // Sort by creation time if needed
  );
  return stmt.all(projectId);
}
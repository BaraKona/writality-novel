import { database } from './index';

// Create table for projects if not exists, with timestamps
database?.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function createProject(name: string): { id: number } {
  const stmt = database.prepare(
    'INSERT INTO projects (name, description, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
  );
  const result = stmt.run(name, 'New beginnings...');
  
  // Return the last inserted row ID
  return { id: result.lastInsertRowid as number };
}

export function getProject(id: number) {
  const stmt = database.prepare('SELECT * FROM projects WHERE id = ?');
  return stmt.get(id);
}

export function updateProject(id: number, name: string, description: string) {
  const stmt = database.prepare(
    'UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  return stmt.run(name, description, id);
}

export function deleteProject(id: number) {
  const stmt = database.prepare('DELETE FROM projects WHERE id = ?');
  return stmt.run(id);
}

export function getAllProjects() {
  const stmt = database.prepare('SELECT * FROM projects ORDER BY created_at ASC'); // Order by creation time
  return stmt.all();
}

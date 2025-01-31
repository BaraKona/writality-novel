import { Project } from '@shared/models';
import { database } from './index';

// Create table for projects if not exists, with timestamps
database?.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    background_image TEXT,
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
  const project = stmt.get(id);
  if (project && project.emoji) {
    project.emoji = JSON.parse(project.emoji); // Convert JSON string back to object
  }
  return project;
}

export function updateProject(project: Project) {

  const stmt = database.prepare(
    'UPDATE projects SET name = ?, description = ?, emoji = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  );
  return stmt.run(
    project.name,
    project.description,
    JSON.stringify(project.emoji), // Convert object to JSON
    project.id
  );
}

export function deleteProject(id: number) {
  const stmt = database.prepare('DELETE FROM projects WHERE id = ?');
  return stmt.run(id);
}

export function getAllProjects() {
  const stmt = database.prepare('SELECT * FROM projects ORDER BY created_at ASC');
  const projects = stmt.all();
  return projects.map(project => ({
    ...project,
    emoji: project.emoji ? JSON.parse(project.emoji) : null
  }));
}

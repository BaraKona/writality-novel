import { Project } from '@shared/models'
import { database, deserialize, serialize } from './index'

// Ensure the database is initialized
if (!database) {
  throw new Error('Database not initialized')
}

// SQL Queries
const CREATE_PROJECTS_TABLE = `
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    background_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`

const INSERT_PROJECT = `
  INSERT INTO projects (name, description, created_at, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`

const SELECT_PROJECT_BY_ID = 'SELECT * FROM projects WHERE id = ?'
const UPDATE_PROJECT = `
  UPDATE projects
  SET name = ?, description = ?, emoji = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`
const DELETE_PROJECT = 'DELETE FROM projects WHERE id = ?'
const SELECT_ALL_PROJECTS = 'SELECT * FROM projects ORDER BY created_at ASC'

// Create table for projects if not exists, with timestamps
database.exec(CREATE_PROJECTS_TABLE)

export function createProject(name: string): { id: number } {
  try {
    const stmt = database.prepare(INSERT_PROJECT)
    const result = stmt.run(name, serialize({ blocks: [] })) // Convert object to JSON string
    return { id: result.lastInsertRowid as number }
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export function getProject(id: number): Project | null {
  try {
    const stmt = database.prepare(SELECT_PROJECT_BY_ID)
    const project = stmt.get(id) as Project | undefined

    if (!project) return null

    // Convert JSON strings back to objects
    project.description = deserialize(project.description)
    project.emoji = deserialize(project.emoji)

    return project
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

export function updateProject(project: Project): Project | null {
  try {
    const stmt = database.prepare(UPDATE_PROJECT)
    stmt.run(
      project.name,
      serialize(project.description), // Convert object to JSON string
      serialize(project.emoji), // Convert object to JSON string
      project.id
    )
    return getProject(project.id) // Return the updated record
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export function deleteProject(id: number): boolean {
  try {
    const stmt = database.prepare(DELETE_PROJECT)
    const result = stmt.run(id)
    return result.changes > 0 // Return true if a project was deleted
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

export function getAllProjects(): Project[] {
  try {
    const stmt = database.prepare(SELECT_ALL_PROJECTS)
    const projects = stmt.all() as Project[]
    return projects.map((project) => ({
      ...project,
      description: deserialize(project.description),
      emoji: deserialize(project.emoji)
    }))
  } catch (error) {
    console.error('Error fetching all projects:', error)
    throw error
  }
}

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
const SELECT_PROJECT_FILES = `
  SELECT id, name, parent_id, parent_type, created_at, updated_at 
  FROM chapters 
  WHERE parent_id = ? AND parent_type = 'project'
`
const SELECT_PROJECT_FOLDERS = `
  SELECT id, name, project_id, parent_folder_id, created_at, updated_at 
  FROM folders 
  WHERE project_id = ? AND parent_folder_id IS NULL
`

// Create table for projects if not exists, with timestamps
database.exec(CREATE_PROJECTS_TABLE)

export const useProject = () => {
  function createProject(name?: string): { id: number } {
    try {
      const stmt = database.prepare(INSERT_PROJECT)
      const result = stmt.run(name || 'New Project', serialize({ blocks: [] })) // Convert object to JSON string
      return { id: result.lastInsertRowid as number }
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  function getProject(id: number): Project | null {
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

  function updateProject(project: Project): Project | null {
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

  function deleteProject(id: number): boolean {
    try {
      const stmt = database.prepare(DELETE_PROJECT)
      const result = stmt.run(id)
      return result.changes > 0 // Return true if a project was deleted
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  function getAllProjects(): Project[] {
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

  // This function should get all the chapters where the parent_id is the project_id
  // and all the folders where the project_id is the project_id and the parent_folder_id is null
  function getProjectFiles(project_id: number): any {
    try {
      const stmt = database.prepare(SELECT_PROJECT_FILES)
      const stmt2 = database.prepare(SELECT_PROJECT_FOLDERS)
      const chapters = stmt.all(project_id)
      const folders = stmt2.all(project_id)
      return { chapters, folders }
    } catch (error) {
      console.error('Error fetching project files:', error)
      throw error
    }
  }

  return {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProjectFiles
  }
}

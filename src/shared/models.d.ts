import { NavigateOptions } from '@tanstack/react-router'

export type ProjectDirectory = {
  name: string
  theme: string
  projectPath: string
  currentProjectId: number
  setupCompleted: boolean
}
export type Tab = {
  id: number
  position: number
  name: string
  url: NavigateOptions['to']
  search?: NavigateOptions['search']
  active: boolean | false
}

export interface Project {
  id: number
  name: string
  description: string
  emoji: string
  background_image?: string
  created_at?: string
  updated_at?: string
  folders?: Folder[] // Optional, for nested folders
  chapters?: Chapter[] // Optional, for chapters belonging to the project
}

export interface Chapter {
  id: number
  parent_type: 'project' | 'folder' // Indicates whether the chapter belongs to a project or folder
  parent_id: number // ID of the project or folder
  name: string
  description: string
  position: number
  created_at: string
  updated_at: string
  ancestors?: {
    id: number
    name: string
    type: string
  }[]
}

export interface Folder {
  id: number
  project_id: number
  parent_folder_id: number | null // Optional, for nested folders
  name: string
  description: string
  emoji: Emoji
  position: number
  created_at?: string
  updated_at?: string
  children?: Folder[] // Optional, for nested folders
  chapters?: Chapter[] // Optional, for chapters
}

export interface Emoji {
  native: string
  type: string
  name: string
  unified: string
  shortcodes: string[]
  emoticons: string[]
  src: string
}

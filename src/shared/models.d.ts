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

export type Project = {
  id: number
  name: string
  description: unknown
  created_at: string
  updated_at: string
  emoji: Emoji
  background_image: string
}

export interface Chapter {
  id?: number
  folder_id: number
  name: string
  description: string
  position: number
  created_at?: string
  updated_at?: string
}

export interface Folder {
  id: number
  project_id: number
  parent_folder_id?: number | null // Optional, for nested folders
  name: string
  description: string
  emoji: Emoji
  position: number
  created_at?: string
  updated_at?: string
  children?: Folder[] // Optional, for nested folders
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

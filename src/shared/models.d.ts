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
  description: string
  created_at: string
  updated_at: string
  emoji: string
}
import { NavigateOptions } from '@tanstack/react-router'

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
}
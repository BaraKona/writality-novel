'use client'

import * as React from 'react'
import { ChevronsUpDown, GalleryVerticalEnd, LibraryBig, PieChart, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@renderer/components/ui/sidebar'
import { useCreateProject } from '@renderer/hooks/project/useCreateProject'
import { useNavigate } from '@tanstack/react-router'
import { EmojiDisplay } from './EmojiDisplay'
import { Project } from '@shared/models'

const teams = [
  {
    name: 'All Projects',
    logo: GalleryVerticalEnd,
    url: '/overview'
  },
  {
    name: 'Global Analytics',
    logo: PieChart,
    url: '/analytics'
  }
]

export function ProjectSwitcher({ currentProject }: { currentProject: Project }) {
  const { mutate: createProject } = useCreateProject()
  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-default bg-cover p-1 bg-center text-sidebar-primary-foreground"> */}
              {/* <LibraryBig className="size-4" /> */}
              <div className="bg-background/20 rounded backdrop-blur-sm">
                <EmojiDisplay emoji={currentProject.emoji} type="project" />
                {/* </div> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentProject.name}</span>
                <span className="truncate text-xs">Fantasy</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() =>
                  navigate({
                    to: team.url
                  })
                }
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={() => createProject()}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">New project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

'use client'

import { Folder, Forward, MoreHorizontal, Plus, Trash2, type LucideIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from '@renderer/components/ui/sidebar'
import { Project } from '@shared/models'
import { useCreateFolder } from '@renderer/hooks/folder/useCreateFolder'
import { useProjectFolders } from '@renderer/hooks/folder/useProjectFolders'
import { Link } from '@tanstack/react-router'
import { EmojiDisplay } from '../EmojiDisplay'

export function SidebarFiles({ project }: { project: Project }) {
  const { data: projectFolders } = useProjectFolders(project?.id)
  const { mutate: createProjectFolder } = useCreateFolder(project?.id)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        Files
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Plus />
            <span className="sr-only">More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg" side={'right'} align="start">
            <DropdownMenuItem onClick={() => createProjectFolder()}>
              <Folder className="text-muted-foreground" />
              <span>Create Folder</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Forward className="text-muted-foreground" />
              <span>Share Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 className="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroupLabel>
      <SidebarMenu>
        {projectFolders?.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={`/folders/${item.id}`} activeProps={{ className: 'bg-sidebar-accent' }}>
                <EmojiDisplay emoji={item.emoji} />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-lg" side={'right'} align="start">
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Folder</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

// ;<DropdownMenu>
//   <DropdownMenuTrigger asChild>
//     <SidebarMenuAction showOnHover>
//       <Plus />
//       <span className="sr-only">More</span>
//     </SidebarMenuAction>
//   </DropdownMenuTrigger>
//   <DropdownMenuContent className="w-48 rounded-lg" side={'right'} align="start">
//     <DropdownMenuItem>
//       <Folder className="text-muted-foreground" />
//       <span>View Project</span>
//     </DropdownMenuItem>
//     <DropdownMenuItem>
//       <Forward className="text-muted-foreground" />
//       <span>Share Project</span>
//     </DropdownMenuItem>
//     <DropdownMenuSeparator />
//     <DropdownMenuItem>
//       <Trash2 className="text-muted-foreground" />
//       <span>Delete Project</span>
//     </DropdownMenuItem>
//   </DropdownMenuContent>
// </DropdownMenu>

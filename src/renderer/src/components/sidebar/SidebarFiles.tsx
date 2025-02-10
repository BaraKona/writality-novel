import {
  ChevronRight,
  FilePlus,
  FileText,
  Folder,
  FolderPlus,
  Forward,
  MoreHorizontal,
  Plus,
  Trash2,
  type LucideIcon
} from 'lucide-react'

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
import { Button } from '../ui/button'
import { useCreateChapter } from '@renderer/hooks/chapter/useCreateChapter'
import { FolderListItem } from './FolderListItem'
import useLocalStorage from '@renderer/hooks/useLocalstorage'

export function SidebarFiles({ project }: { project: Project }) {
  const { data: projectFolders } = useProjectFolders(project?.id)
  const { mutate: createProjectFolder } = useCreateFolder(project?.id)
  const { mutate: createChapter } = useCreateChapter(project?.id)

  const [openFolders, setOpenFolders] = useLocalStorage<{ [key: string]: boolean }>(
    'openFolders',
    {}
  )

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between items-center">
        Files
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Plus size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg" side={'right'} align="start">
            <DropdownMenuItem onClick={() => createProjectFolder(null)}>
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
          <FolderListItem
            key={item.id}
            folder={item}
            level={0}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
          />
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

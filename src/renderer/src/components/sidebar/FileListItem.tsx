import { Chapter } from '@shared/models'
import { FileText, Forward, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from '@renderer/components/ui/sidebar'
import { Link } from '@tanstack/react-router'

export const FileListItem = ({
  chapter,
  level,
  spacing = 15
}: {
  chapter: Chapter
  level: number
  spacing?: number
}) => {
  return (
    <SidebarMenuItem key={chapter.name} className={`relative ${level > 0 ? 'mt-0.5' : ''}`}>
      <SidebarMenuButton asChild>
        <Link
          to={`/chapters/${chapter.id}`}
          activeProps={{ className: 'bg-sidebar-accent' }}
          className={`group ${level === 0 ? 'pl-3.5' : ''}`}
        >
          <FileText
            className="shrink-0"
            size={16}
            style={{
              marginLeft: `${level * spacing + (level === 0 ? 0 : 7)}px`
            }}
          />
          <span>{chapter.name}</span>
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
            <Forward className="text-muted-foreground" />
            <span>Share Project</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete Chapter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

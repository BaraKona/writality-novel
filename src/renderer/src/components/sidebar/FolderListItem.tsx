import { Folder } from '@shared/models'
import {
  FilePlus,
  FolderIcon,
  FolderOpenIcon,
  FolderPlus,
  Forward,
  MoreHorizontal,
  Trash2
} from 'lucide-react'

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
import { EmojiDisplay } from '../EmojiDisplay'
import { Button } from '../ui/button'
import { useCreateChapter } from '@renderer/hooks/chapter/useCreateChapter'
import { useCreateFolder } from '@renderer/hooks/folder/useCreateFolder'
import { FileListItem } from './FileListItem'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useFolderTree } from '@renderer/hooks/folder/useFolderTree'

export const FolderListItem = ({
  folder,
  level,
  openFolders,
  setOpenFolders
}: {
  folder: Folder
  level: number
  openFolders: { [key: string]: boolean }
  setOpenFolders: (value: { [key: string]: boolean }) => void
}) => {
  const { mutate: createChapter } = useCreateChapter(folder.id)
  const { mutate: createProjectFolder } = useCreateFolder(folder.project_id)
  const { data: folderFiles } = useFolderTree(folder.id)
  const [animate] = useAutoAnimate()
  const spacing = 15

  return (
    <div className={`relative ${level > 0 ? 'mt-0.5' : ''}`} ref={animate}>
      <div
        className="absolute bg-border z-10 bottom-0"
        style={{
          left: `${spacing + level * spacing + 7}px`,
          width: '1px',
          height: 'calc(100% - 2.1rem)'
        }}
      ></div>
      <SidebarMenuItem key={folder.name}>
        <SidebarMenuButton asChild>
          <Link
            to={'/folders/$folderId'}
            params={{ folderId: folder.id.toString() }}
            activeProps={{ className: 'bg-sidebar-accent' }}
            className={`group flex items-center gap-2 px-2 py-1.5 ring-0 outline-none group/folder cursor-default relative
              ${level === 0 ? 'pl-3.5' : ''}`}
          >
            <div
              className="flex"
              style={{
                paddingLeft: `${level * spacing + (level === 0 ? 0 : 7)}px`
              }}
            >
              <EmojiDisplay
                emoji={folder.emoji}
                folderOpen={openFolders[folder.id]}
                className="group-hover/menu-item:hidden block"
                type="folder"
              />
              <Button
                className="group-hover/menu-item:block hidden p-0"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenFolders({ ...openFolders, [folder.id]: !openFolders[folder.id] })
                }}
              >
                {openFolders[folder.id] ? <FolderOpenIcon size={16} /> : <FolderIcon size={16} />}
              </Button>
            </div>
            <span>{folder.name}</span>
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
            <DropdownMenuItem onClick={() => createChapter('folder')}>
              <FilePlus className="text-muted-foreground" />
              <span>New File</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createProjectFolder(folder.id)}>
              <FolderPlus className="text-muted-foreground" />
              <span>New folder</span>
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
      {openFolders[folder.id] && (
        <div className="">
          {folderFiles?.children?.map((item) => (
            <FolderListItem
              key={item.id}
              folder={item}
              level={level + 1}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
            />
          ))}
          {folderFiles?.chapters?.map((chapter) => (
            <FileListItem key={chapter.id} chapter={chapter} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

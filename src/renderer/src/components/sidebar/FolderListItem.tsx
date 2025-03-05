import { Folder } from '@shared/models'
import {
  FilePlus,
  FolderIcon,
  FolderOpenIcon,
  FolderPlus,
  Forward,
  MoreHorizontal,
  SquareArrowDown,
  SquareArrowRight,
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
import { FolderFilled, TriangleDown } from '@renderer/assets/FolderFilled'
import { TriangleRight } from '@renderer/assets/TriangleRight'

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
        className="absolute bottom-0 z-10 bg-border"
        style={{
          left: `${spacing + level * spacing + 7}px`,
          width: '1px',
          height: 'calc(100% - 2.1rem)'
        }}
      ></div>
      <div key={folder.name} className="flex w-full">
        <Link
          to={'/folders/$folderId'}
          params={{ folderId: folder.id.toString() }}
          activeProps={{ className: 'bg-sidebar-accent' }}
          className={`group group/folder peer relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-sm ring-0 outline-none hover:bg-accent ${level === 0 ? 'pl-3.5' : ''}`}
        >
          <div
            className="flex"
            style={{
              paddingLeft: `${level * spacing + (level === 0 ? 0 : 7)}px`
            }}
          >
            {/* <Button
                className="mr-2 p-0"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenFolders({ ...openFolders, [folder.id]: !openFolders[folder.id] })
                }}
              >
                {openFolders[folder.id] ? <SquareArrowDown /> : <SquareArrowRight />}
              </Button> */}
            {/* <EmojiDisplay
                emoji={folder.emoji}
                folderOpen={openFolders[folder.id]}
                className="block group-hover/menu-item:hidden"
                type="folder"
              /> */}
            <Button
              className="p-0"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenFolders({ ...openFolders, [folder.id]: !openFolders[folder.id] })
              }}
            >
              {openFolders[folder.id] ? (
                <FolderOpenIcon size={18} />
              ) : (
                <FolderFilled className="fill-muted-foreground stroke-muted-foreground" />
              )}
            </Button>
          </div>
          <span>{folder.name}</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="peer:hover:block hidden">
            <SidebarMenuAction>
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
      </div>
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

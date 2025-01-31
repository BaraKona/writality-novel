import { useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { BookOpenTextIcon, BookTextIcon, Ellipsis, Trash2Icon, Plus } from 'lucide-react'
import { defaultDateTimeFormat } from '@shared/functions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { useDeleteProject } from '@renderer/hooks/project/useDeleteProject'
import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { Project } from '@shared/models'

export const ProjectCard: FC<{ project?: Project; isCreate?: boolean; onClick: () => void }> = ({
  project,
  isCreate,
  onClick
}) => {
  const { data: currentProjectDir } = useCurrentDir()
  const { mutate } = useDeleteProject()


  if (isCreate || !project ) {
    return (
      <div className="p-1" onClick={onClick}>
        <div className="rounded-xl group bg-secondaryBackground border relative h-44 grid place-items-center hover:border-secondaryBorder/50 transition-colors duration-300 ease-in-out">
          <Plus size={30} className=" group-hover:stroke-secondaryText" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-md relative flex items-center transition-colors duration-300 ease-in-out hover:bg-accent p-2 py-1 cursor-default ${
        currentProjectDir?.currentProjectId === project.id ? 'bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <DropdownMenu>
        <div className="grow h-full w-full flex items-center justify-between gap-2">
          <div className="font-medium text-sm flex items-center gap-2">
            {currentProjectDir?.currentProjectId === project.id ? (
              <BookOpenTextIcon size={16} strokeWidth={2} />
            ) : (
              <BookTextIcon size={16} strokeWidth={2} />
            )}
            {project.name}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs">{defaultDateTimeFormat(project.updated_at ?? new Date())}</div>
            <DropdownMenuTrigger className="p-1 rounded-md hover:bg-secondaryBackground hover:text-secondaryText">
              <Ellipsis size={16} strokeWidth={2} />
            </DropdownMenuTrigger>
          </div>
        </div>
        <DropdownMenuContent className="bg-background text-text">
          <DropdownMenuItem
            className="flex gap-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              mutate(project.id)
            }}
          >
            <Trash2Icon size={16} strokeWidth={2} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

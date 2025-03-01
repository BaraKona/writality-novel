import { useLocation, useNavigate } from '@tanstack/react-router'
import { FC, ReactNode } from 'react'
import { FileVersions } from './FileVersions'
import { ModalShell } from '@renderer/components/Modal'
import { useQueryClient } from '@tanstack/react-query'
import { TextFile, Version } from '@shared/models'
import { Editor } from '@renderer/components/editor/Editor'
import { FileStackIcon, LightbulbIcon, ListTodoIcon, PencilRulerIcon } from 'lucide-react'
import { FileTodos } from './FileTodos'
import { FileDrafts } from './FileDraft'
import { FileNotes } from './FileNotes'

type FileSidebarListItemProps = {
  name: string
  children?: ReactNode
  active?: boolean
  setSidebarState?: (state) => void
}

export const FileSidebar: FC<{
  file?: TextFile
  sidebarState: string
  setSidebarState: (state) => void
}> = ({ file, sidebarState, setSidebarState }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const versions = queryClient.getQueryData(['versions', location.pathname]) as Version[]
  const theme = queryClient.getQueryData(['theme']) as string

  const selectedVersion = versions?.find((version) => version.name === location.search.version)

  return (
    <div className="pb-1 h-full flex flex-col">
      <div className="px-2 flex gap-4 w-full border-b relative py-1 text-xs font-medium">
        <FileSidebarListItem
          name="notes"
          active={sidebarState === 'notes'}
          setSidebarState={setSidebarState}
        >
          <LightbulbIcon size={16} strokeWidth={2} />
        </FileSidebarListItem>
        <FileSidebarListItem
          name="todo"
          active={sidebarState === 'todo'}
          setSidebarState={setSidebarState}
        >
          <ListTodoIcon size={16} strokeWidth={2} />
        </FileSidebarListItem>
        <FileSidebarListItem
          name="versions"
          active={sidebarState === 'versions'}
          setSidebarState={setSidebarState}
        >
          <FileStackIcon size={16} strokeWidth={2} />
        </FileSidebarListItem>
        <FileSidebarListItem
          name="drafts"
          active={sidebarState === 'drafts'}
          setSidebarState={setSidebarState}
        >
          <PencilRulerIcon size={16} strokeWidth={2} />
        </FileSidebarListItem>
      </div>
      <div className="h-full flex flex-col grow overflow-y-auto pt-2">
        {sidebarState === 'notes' && <FileNotes file={file} />}
        {sidebarState === 'todo' && <FileTodos todos={file?.data.todos || []} />}
        {sidebarState === 'versions' && <FileVersions />}
        {sidebarState === 'drafts' && <FileDrafts />}
      </div>
      <ModalShell
        open={location.search.version}
        setOpen={() => navigate({ search: { ...location.search, version: undefined } })}
        title={selectedVersion?.name}
        className="w-[90%] h-[90%] max-w-none border-l pb-1 "
      >
        <Editor fileContent={selectedVersion?.content} title={selectedVersion?.name} />
      </ModalShell>
    </div>
  )
}

function FileSidebarListItem({
  name,
  children,
  active,
  setSidebarState
}: FileSidebarListItemProps) {
  const navigate = useNavigate()
  return (
    <div
      className={`flex items-center cursor-default gap-1 py-1 relative ${active ? 'text-secondaryBackground' : ''}`}
      // @ts-ignore
      onClick={() => setSidebarState(name)}
    >
      <span className="shrink-0">{children}</span>
      <span className="capitalize">{name}</span>
      {active && (
        <div className="absolute -bottom-[5px] w-10 right-0 left-0 mx-auto h-0.5 rounded bg-accent" />
      )}
    </div>
  )
}

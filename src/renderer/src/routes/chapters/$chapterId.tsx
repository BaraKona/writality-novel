import { useChapter } from '@renderer/hooks/chapter/useChapter'
import { useDebounce } from '@renderer/hooks/useDebounce'
import { createFileRoute } from '@tanstack/react-router'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteSchema, locales } from '@blocknote/core'
import {
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn
} from '@blocknote/xl-multi-column'
import { useUpdateChapter } from '@renderer/hooks/chapter/useUpdateChapter'
import { Infobar } from '@renderer/components/chapter/InfoBar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
import useLocalStorage from '@renderer/hooks/useLocalStorage'
import { FileSidebar } from '@renderer/components/file/FileSidebar'
import { BasicEditor } from '@renderer/components/editor/BasicEditor'
import { useCreateEditor } from '@renderer/components/editor/use-create-editor'
import { useMemo } from 'react'

export const Route = createFileRoute('/chapters/$chapterId')({
  component: RouteComponent
})

function RouteComponent() {
  const { chapterId } = Route.useParams()

  const { data: chapter } = useChapter(Number(chapterId))
  const { mutate: updateChapter } = useUpdateChapter()
  const editor = useCreateEditor({ value: chapter?.description })

  const [sidebarState, setSidebarState] = useLocalStorage('sidebarState', 'note')

  const debouncedFunc = useDebounce(
    (value) => updateChapter({ ...chapter, description: value }),
    2000
  )

  if (!chapter) {
    return null
  }

  return (
    <ResizablePanelGroup
      className="flex grow overflow-y-auto"
      key={chapterId}
      direction="horizontal"
    >
      <ResizablePanel
        key="file-sidebar"
        defaultSize={20}
        className={`group relative flex h-full w-96 max-w-[600px] min-w-80 grow flex-col overflow-y-auto p-2 pt-1 pr-0.5 ${sidebarState ? 'show' : 'hide'}`}
      >
        <FileSidebar setSidebarState={setSidebarState} sidebarState={sidebarState || ''} />
      </ResizablePanel>
      <ResizableHandle className={`${sidebarState ? 'show' : 'hide'}`} key="111" />
      <ResizablePanel
        className="relative z-10 flex w-full grow flex-col overflow-y-auto"
        defaultSize={80}
        key="file-content"
      >
        <Infobar
          chapter={chapter}
          word={1000}
          setSidebarState={setSidebarState}
          sidebarState={sidebarState || ''}
        />
        <div className="relative flex h-full w-full flex-col overflow-y-auto px-16" key={chapterId}>
          <div className="mx-auto w-full max-w-3xl px-2 pt-14">
            <h1
              className="text-editorText mt-4 min-h-fit font-serif-thick text-4xl font-semibold ring-0 outline-none"
              contentEditable={true}
              onBlur={(e) =>
                chapter && updateChapter({ ...chapter, name: e.currentTarget.innerText.trim() })
              }
              dangerouslySetInnerHTML={{
                __html: chapter?.name || ''
              }}
            />
            <BasicEditor
              editor={editor}
              setContent={(value) => debouncedFunc(value)}
              className="mt-4"
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

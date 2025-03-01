import { useChapter } from '@renderer/hooks/chapter/useChapter'
import { useDebounce } from '@renderer/hooks/useDebounce'
import { createFileRoute } from '@tanstack/react-router'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
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

export const Route = createFileRoute('/chapters/$chapterId')({
  component: RouteComponent
})

function RouteComponent() {
  const { chapterId } = Route.useParams()

  const { data: chapter } = useChapter(Number(chapterId))
  const { mutate: updateChapter } = useUpdateChapter()

  const [sidebarState, setSidebarState] = useLocalStorage('sidebarState', 'note')

  const editor = useCreateBlockNote(
    {
      // Adds column and column list blocks to the schema.
      schema: withMultiColumn(BlockNoteSchema.create()),
      // The default drop cursor only shows up above and below blocks - we replace
      // it with the multi-column one that also shows up on the sides of blocks.
      dropCursor: multiColumnDropCursor,
      // Merges the default dictionary with the multi-column dictionary.
      dictionary: {
        ...locales.en,
        multi_column: multiColumnLocales.en
      },
      initialContent: chapter?.description || undefined
    },
    [chapter]
  )

  const debouncedSaveFile = useDebounce(
    () => updateChapter({ ...chapter, description: editor.document }),
    200
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
        <div
          className="relative mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto px-16"
          key={chapterId}
        >
          <div className="w-full px-2 pt-14">
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
            <BlockNoteView
              editor={editor}
              className="-mx-12 mt-4 h-full"
              data-color-scheme="theme-light"
              onChange={debouncedSaveFile}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle className={`${sidebarState ? 'show' : 'hide'}`} key="111" />
      <ResizablePanel
        key="file-sidebar"
        defaultSize={20}
        className={`group relative mt-1 mr-2 flex h-full w-96 max-w-[600px] min-w-80 grow flex-col rounded-lg ring shadow ring-border ${sidebarState ? 'show' : 'hide'}`}
      >
        <FileSidebar setSidebarState={setSidebarState} sidebarState={sidebarState || ''} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

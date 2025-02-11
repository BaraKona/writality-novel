import { useChapter } from '@renderer/hooks/chapter/useChapter'
import { useDebounce } from '@renderer/hooks/useDebounce'
import { createFileRoute } from '@tanstack/react-router'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote
} from '@blocknote/react'
import { BlockNoteSchema, combineByGroup, filterSuggestionItems, locales } from '@blocknote/core'
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn
} from '@blocknote/xl-multi-column'
import { useUpdateChapter } from '@renderer/hooks/chapter/useUpdateChapter'
import { Clock3, FileClock } from 'lucide-react'
import { defaultDateTimeFormat, getTimeFromNow } from '@renderer/lib/utils'
import { Infobar } from '@renderer/components/chapter/InfoBar'

export const Route = createFileRoute('/chapters/$chapterId')({
  component: RouteComponent
})

function RouteComponent() {
  const { chapterId } = Route.useParams()

  const { data: chapter } = useChapter(Number(chapterId))
  const { mutate: updateChapter } = useUpdateChapter()

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
    <section className="">
      <Infobar chapter={chapter} word={1000} setSidebarState={() => {}} sidebarState="" />
      <div className="max-w-5xl mx-auto px-16 relative h-full w-full flex flex-col" key={chapterId}>
        <div className="w-full pt-14 px-2">
          <h1
            className="text-4xl min-h-fit mt-4 font-semibold text-editorText ring-0 outline-none"
            contentEditable={true}
            onBlur={(e) =>
              chapter && updateChapter({ ...chapter, name: e.currentTarget.innerText.trim() })
            }
            dangerouslySetInnerHTML={{
              __html: chapter?.name || ''
            }}
          />
          {/* <div className="flex gap-3">
          <div className="flex gap-1 mt-1 items-center text-xs text-secondaryText">
            <FileClock size={16} className="text-text" />
            {defaultDateTimeFormat(chapter?.created_at || '')}
          </div>
          <div className="flex gap-1 mt-1 items-center text-xs text-secondaryText">
            <Clock3 size={16} className="text-text" />
            {getTimeFromNow(chapter?.updated_at || '')}
          </div>
        </div> */}
          <BlockNoteView
            editor={editor}
            className="mt-4 -mx-12 h-full"
            data-color-scheme="theme-light"
            onChange={debouncedSaveFile}
          />
        </div>
      </div>
    </section>
  )
}

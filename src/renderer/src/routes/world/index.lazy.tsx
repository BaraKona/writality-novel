import { createLazyFileRoute } from '@tanstack/react-router'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { Clock3, FileClock } from 'lucide-react'
import { getTimeFromNow } from '@renderer/lib/utils'
import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { useProject } from '@renderer/hooks/project/useProject'
import { useUpdateProject } from '@renderer/hooks/project/useUpdateProject'
import { defaultDateTimeFormat } from '@shared/functions'
import { custom_emojis } from '@renderer/lib/custom_emoji'

import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { BlockNoteSchema, combineByGroup, filterSuggestionItems, locales } from '@blocknote/core'
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote
} from '@blocknote/react'
import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn
} from '@blocknote/xl-multi-column'
import { useMemo } from 'react'
import { useDebounce } from '@renderer/hooks/useDebounce'

export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent
})

function RouteComponent() {
  const { data: currentDir } = useCurrentDir()

  const { data: project } = useProject(currentDir.currentProjectId)
  const { mutate: updateProject } = useUpdateProject()

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
      initialContent: project?.description
    },
    [project]
  )

  const debouncedSaveFile = useDebounce(
    () => updateProject({ ...project, description: editor.document }),
    1000
  )

  return (
    <div className="w-full">
      <div className="relative h-[35vh] w-full bg-default bg-cover bg-center bg-no-repeat"></div>
      <div className="relative mx-auto h-full max-w-5xl px-16">
        <Popover>
          <PopoverTrigger className="absolute -top-18 z-10 text-[6em]">
            {project?.emoji?.src ? (
              <img src={project?.emoji?.src} alt="emoji" className="h-28 w-28" />
            ) : (
              project?.emoji?.native || <span>📖</span>
            )}
          </PopoverTrigger>

          <PopoverContent className="border-0 p-0">
            <Picker
              data={data}
              custom={custom_emojis}
              onEmojiSelect={(e) => project && updateProject({ ...project, emoji: e })}
              theme="light"
              skinTonePosition="search"
            />
          </PopoverContent>
        </Popover>
        <section className="w-full px-2 pt-14">
          <h1
            className="text-editorText mt-4 min-h-fit font-serif-thick text-5xl ring-0 outline-none"
            contentEditable={true}
            onBlur={(e) =>
              project && updateProject({ ...project, name: e.currentTarget.innerText.trim() })
            }
            dangerouslySetInnerHTML={{
              __html: project?.name || ''
            }}
          />
          <div className="flex gap-3">
            <div className="text-secondaryText mt-1 flex items-center gap-1 text-xs">
              <FileClock size={16} className="text-text" />
              {defaultDateTimeFormat(project?.created_at || '')}
            </div>
            <div className="text-secondaryText mt-1 flex items-center gap-1 text-xs">
              <Clock3 size={16} className="text-text" />
              {getTimeFromNow(project?.updated_at || '')}
            </div>
          </div>
          <BlockNoteView
            editor={editor}
            className="-mx-12 mt-4 h-full"
            data-color-scheme="theme-light"
            onChange={debouncedSaveFile}
          />
        </section>
      </div>
    </div>
  )
}

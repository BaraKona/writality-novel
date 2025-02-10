import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { useFolderById } from '@renderer/hooks/folder/useFolderById'
import { createFileRoute } from '@tanstack/react-router'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Clock3, FileClock } from 'lucide-react'
import { getTimeFromNow } from '@renderer/lib/utils'

import { defaultDateTimeFormat } from '@shared/functions'
import { custom_emojis } from '@renderer/lib/custom_emoji'
import { useUpdateFolder } from '@renderer/hooks/folder/useUpdateFolder'
import { ChapterListItem } from '@renderer/components/sidebar/ChapterListItem'

export const Route = createFileRoute('/folders/$folderId')({
  component: RouteComponent
})

function RouteComponent() {
  const { folderId } = Route.useParams()

  const { data: folder } = useFolderById(Number(folderId))
  const { mutate: updateFolder } = useUpdateFolder()

  return (
    <div className="w-full">
      <div className="relative h-[35vh] bg-cover bg-center bg-3 w-full bg-no-repeat"></div>
      <div className="max-w-5xl mx-auto px-16 relative h-full">
        <Popover>
          <PopoverTrigger className="absolute -top-18 text-[6em] z-10">
            {folder?.emoji?.src ? (
              <img src={folder?.emoji?.src} alt="emoji" className="w-28 h-28" />
            ) : (
              folder?.emoji?.native || <span>📖</span>
            )}
          </PopoverTrigger>

          <PopoverContent className="border-0 p-0">
            <Picker
              data={data}
              custom={custom_emojis}
              onEmojiSelect={(e) => folder && updateFolder({ ...folder, emoji: e })}
              theme="light"
              skinTonePosition="search"
            />
          </PopoverContent>
        </Popover>
        <section className="w-full pt-14 px-2">
          <h1
            className="text-4xl min-h-fit mt-4 font-semibold text-editorText ring-0 outline-none"
            contentEditable={true}
            onBlur={(e) =>
              folder && updateFolder({ ...folder, name: e.currentTarget.innerText.trim() })
            }
            dangerouslySetInnerHTML={{
              __html: folder?.name || ''
            }}
          />
          <div className="flex gap-3">
            <div className="flex gap-1 mt-1 items-center text-xs text-secondaryText">
              <FileClock size={16} className="text-text" />
              {defaultDateTimeFormat(folder?.created_at || '')}
            </div>
            <div className="flex gap-1 mt-1 items-center text-xs text-secondaryText">
              <Clock3 size={16} className="text-text" />
              {getTimeFromNow(folder?.updated_at || '')}
            </div>
          </div>
          {/* <BlockNoteView
            editor={editor}
            className="mt-4 -mx-12 h-full"
            data-color-scheme="theme-light"
            onChange={debouncedSaveFile}
          /> */}

          <ChapterListItem chapters={folder?.chapters} />
        </section>
      </div>
    </div>
  )
}

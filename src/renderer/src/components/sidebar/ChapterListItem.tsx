import { getDateFromTime, getTimeFromNow } from '@renderer/lib/utils'
import { Chapter } from '@shared/models'
import { FileClock, Plus, Share, Trash2 } from 'lucide-react'
import { SmallEditor } from '../editor/SmallEditor'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export const ChapterListItem = ({ chapters }: { chapters?: Chapter[] }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-2 mt-8">
      <div className="rounded-md ring-1 ring-border grid place-items-center gap-1 col-span-1 hover:shadow cursor-pointer text-center p-4 h-62">
        <div>
          <Plus size={24} className="mx-auto" />
          <div className="text-sm font-medium">Add new chapter to story</div>
        </div>
      </div>

      {chapters?.map((chapter) => (
        <Link
          to="/chapters/$chapterId"
          params={{ chapterId: chapter.id.toString() }}
          key={chapter.id}
          className="rounded-md group ring-1 relative ring-border flex flex-col col-span-1 hover:shadow cursor-pointer h-62"
        >
          <div className="text-sm font-medium p-4 pb-2">{chapter.name}</div>
          <div className="flex-1 overflow-hidden mb-2">
            {chapter?.description ? (
              <SmallEditor content={chapter?.description || ''} />
            ) : (
              <div className="p-4 text-sm">Nothing written yet... Open me to start writing</div>
            )}
          </div>

          <div className="border-t p-4 flex gap-8 justify-between mt-auto">
            <div className="flex gap-2 items-center text-xs">
              <FileClock size={16} className="shrink-0" />
              <span>{getDateFromTime(chapter.created_at)}</span>
            </div>
            <div className="flex gap-2 items-center text-xs">
              <FileClock size={16} className="shrink-0" />
              <span>{getTimeFromNow(chapter.updated_at)}</span>
            </div>
          </div>
          <div className="absolute -top-2 right-2 ring-1 w-fit gap-0.5 p-1 ring-border rounded-md bg-white  shadow text-xs group-hover:flex hidden">
            <Button size="icon" variant="ghost" className="p-0.75">
              <Share size={16} className="shrink-0" />
            </Button>
            <Button size="icon" variant="ghost" className="p-0.75">
              <Trash2 size={16} className="shrink-0" />
            </Button>
          </div>
        </Link>
      ))}
    </div>
  )
}

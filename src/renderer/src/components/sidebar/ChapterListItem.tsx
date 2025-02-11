import { getDateFromTime, getTimeFromNow } from '@renderer/lib/utils'
import { Chapter } from '@shared/models'
import { FileClock } from 'lucide-react'
import { SmallEditor } from '../editor/SmallEditor'
import { Link, linkOptions } from '@tanstack/react-router'

export const ChapterListItem = ({ chapters }: { chapters?: Chapter[] }) => {
  if (!chapters || chapters.length === 0) {
    return <div>No chapters</div>
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-2 mt-8">
      {chapters.map((chapter) => (
        <Link
          to={`/chapters/$chapterId`}
          params={{ chapterId: chapter.id.toString() }}
          key={chapter.id}
          className="rounded-md border flex flex-col col-span-1 hover:shadow cursor-default"
        >
          <div className="text-sm font-medium p-4">{chapter.name}</div>
          <div className="max-h-48 overflow-hidden my-2">
            {chapter?.description ? (
              <SmallEditor content={chapter?.description || ''} />
            ) : (
              <div className="p-4 text-sm">Nothing writing yet.. Open me to start writing</div>
            )}
          </div>

          <div className="mt-auto border-t p-4 flex gap-8 justify-between">
            <div className="flex gap-2 items-center text-xs">
              <FileClock size={16} className="shrink-0" />
              <span>{getDateFromTime(chapter.created_at)}</span>
            </div>
            <div className="flex gap-2 items-center text-xs">
              <FileClock size={16} className="shrink-0" />
              <span>{getTimeFromNow(chapter.updated_at)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

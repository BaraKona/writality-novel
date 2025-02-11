import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb'
import { getTimeFromNow } from '@renderer/lib/utils'
import {
  BookOpenTextIcon,
  BookTextIcon,
  ChevronRight,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FileTextIcon,
  FolderOpenIcon,
  MenuIcon,
  PencilLineIcon
} from 'lucide-react'
import { FC } from 'react'
import { Separator } from '../ui/separator'
import { Statistic } from '../Statistic'
import { Button } from '../ui/button'
import { Chapter } from '@shared/models'

export const Infobar: FC<{
  chapter: Chapter
  word: number
  setSidebarState: (state: string) => void
  sidebarState: string
}> = ({ chapter, word, setSidebarState, sidebarState }) => {
  console.log()
  return (
    <div className="h-[2.25rem] flex justify-between gap-2 flex-shrink-0 items-center px-2 overflow-x-auto w-full">
      <Breadcrumb className="w-fit shrink-0 flex items-start gap-2">
        {chapter.ancestors?.map((ancestor, index) => (
          <BreadcrumbList key={ancestor.id} className="text-xs font-medium shrink-0">
            <BreadcrumbItem className="shrink-0 flex gap-1 max-w-48">
              {ancestor.type === 'project' ? (
                <BookTextIcon size={16} strokeWidth={1.5} />
              ) : (
                <FolderOpenIcon size={16} strokeWidth={1.5} />
              )}
              <span>{ancestor.name}</span>
            </BreadcrumbItem>
            {index < chapter.ancestors?.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight size={16} strokeWidth={1.5} />
              </BreadcrumbSeparator>
            )}
          </BreadcrumbList>
        ))}
        <BreadcrumbList className="text-xs font-medium shrink-0">
          <BreadcrumbSeparator>
            <ChevronRight size={16} strokeWidth={1.5} />
          </BreadcrumbSeparator>
          <BreadcrumbItem className="shrink-0 flex gap-1 max-w-48">
            <FileTextIcon size={16} strokeWidth={1.5} />
            <span>{chapter?.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-0.5 pr-1">
        <div className="flex items-center gap-1 text-xs text-secondaryText">
          <span className="text-xs font-medium text-text">Words:</span>
          {word}
        </div>
        <Separator orientation="vertical" className="h-4 shrink-0 mx-2" />

        <Statistic
          text="Last edited"
          content={getTimeFromNow(chapter?.updated_at || new Date().getTime())}
          align="right"
          className="shrink-0 text-secondaryText"
        />

        <Button
          variant="ghost"
          size="icon"
          className="group transition-transform ease-in duration-200 ml-1"
        >
          {/* <PencilLineIcon
            size={16}
            strokeWidth={1.5}
            className={`${fileContent?.data.readonly ? 'hidden' : ''}`} */}
          {/* /> */}
          <BookOpenTextIcon size={16} strokeWidth={1.5} />
        </Button>
        <Separator orientation="vertical" className="h-4 shrink-0 mx-2" />

        <button className="group w-5" onClick={() => setSidebarState(sidebarState ? '' : 'notes')}>
          {sidebarState ? (
            <ChevronsRightIcon size={16} strokeWidth={1.5} className="" />
          ) : (
            <>
              <ChevronsLeftIcon size={16} strokeWidth={1.5} className="group-hover:block hidden" />
              <MenuIcon size={16} strokeWidth={1.5} className="group-hover:hidden block" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

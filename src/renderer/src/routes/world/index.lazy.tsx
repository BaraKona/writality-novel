import { useAllProjects } from '@renderer/hooks/project/useAllProjects'
import { createLazyFileRoute } from '@tanstack/react-router'
import  data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { Clock3, FileClock } from 'lucide-react'
import { getTimeFromNow } from '@renderer/lib/utils'
import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { useProject } from '@renderer/hooks/project/useProject'
import { useUpdateProject } from '@renderer/hooks/project/useUpdateProject'
import { defaultDateTimeFormat } from '@shared/functions'
import { custom_emojis } from '@renderer/lib/custom_emoji'
export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent,
})



function RouteComponent() {
  const { data: currentDir, isLoading } = useCurrentDir()
  
  const { data: project } = useProject(currentDir?.currentProjectId)
  const { mutate: updateProject } = useUpdateProject()

  console.log({ project, isLoading })
  return (
    <div className='w-full'>
      <div className="relative h-[35vh] bg-contain bg-default w-full bg-fixed"></div>
        <div className='max-w-5xl mx-auto px-8 relative'>
          <Popover>
            <PopoverTrigger className="absolute -top-18 text-[6em] z-20">
              {project?.emoji?.src ? (
                <img src={project?.emoji?.src} alt="emoji" className="w-28 h-28" />
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
          <section className='w-full pt-14 px-2'>
            <h1
              className="text-4xl min-h-fit mt-4 font-semibold text-editorText ring-0 outline-none"
              contentEditable={true}
              onBlur={(e) => project && updateProject({ ...project, name: e.currentTarget.innerText.trim() })}
              dangerouslySetInnerHTML={{
                __html: project?.name || ''
              }}
            />
             <div className="flex gap-3">
              <div className="flex gap-1 mt-1 items-center text-xs text-secondaryText">
                <FileClock size={16} className="text-text" />
                {defaultDateTimeFormat(project?.created_at || '')}
              </div>
              <div className="flex gap-1 mt-1 items-center text-xs text-secondaryText">
                <Clock3 size={16} className="text-text" />
                {getTimeFromNow(project?.updated_at || '')}
              </div>
            </div>
          </section>
        </div>
    </div>
  )
}

import { useAllProjects } from '@renderer/hooks/project/useAllProjects'
import { createLazyFileRoute } from '@tanstack/react-router'
import  data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'

export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: projects, isLoading } = useAllProjects()

  console.log({ projects, isLoading })
  return (
    <div className='w-full relative'>
      <div className="relative h-[35vh] bg-contain bg-default w-full bg-fixed"></div>
        <div className='max-w-screen-lg max-auto px-8 bg-black'>
          <Popover>
            <PopoverTrigger className="absolute top-[19.6rem] text-[6em] z-20">
              {<span>📖</span>}
            </PopoverTrigger>

            <PopoverContent className="border-0 p-0">
              <Picker
                data={data}
                // onEmojiSelect={(e) => updateStoryboardEmoji(e)}
                theme="light"
                skinTonePosition="search"
              />
            </PopoverContent>
          </Popover>
        </div>
    </div>
  )
}

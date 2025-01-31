import { useAllProjects } from '@renderer/hooks/project/useAllProjects'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useAllProjects()

  console.log({ data, isLoading })
  return (
    <div className='w-full'>
      <div className="relative h-[35vh] bg-contain bg-no-repeat bg-default w-full bg-fixed "></div>
    </div>
  )
}

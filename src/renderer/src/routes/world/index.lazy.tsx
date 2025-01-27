import { useAllProjects } from '@renderer/hooks/project/useAllProjects'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useAllProjects()

  console.log({ data, isLoading })
  return (
    <div className=''>
      <div className="relative h-[35vh] overflow-hidden bg-default w-full"></div>
    </div>
  )
}

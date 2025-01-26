import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className=''>
      <div className="relative h-[35vh] overflow-hidden bg-default w-full"></div>
    </div>
  )
}

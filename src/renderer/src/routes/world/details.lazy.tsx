import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/world/details"!</div>
}

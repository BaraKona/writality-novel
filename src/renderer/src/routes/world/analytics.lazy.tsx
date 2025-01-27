import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/world/analytics"!</div>
}

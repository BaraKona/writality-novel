import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/world/history"!</div>
}

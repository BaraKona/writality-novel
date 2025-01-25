import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/gallery/world')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gallery/world"!</div>
}

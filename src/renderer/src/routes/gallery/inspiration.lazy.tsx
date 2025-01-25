import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/gallery/inspiration')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gallery/inspiration"!</div>
}

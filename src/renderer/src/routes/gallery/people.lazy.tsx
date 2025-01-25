import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/gallery/people')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gallery/people"!</div>
}

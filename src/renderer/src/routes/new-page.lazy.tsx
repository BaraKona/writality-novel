import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/new-page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/new-page"!</div>
}

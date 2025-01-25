import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/world/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/world"!</div>
}

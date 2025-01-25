import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/gallery/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gallery/"!</div>
}

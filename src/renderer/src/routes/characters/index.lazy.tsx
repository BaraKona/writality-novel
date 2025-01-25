import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/characters/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/characters/"!</div>
}
